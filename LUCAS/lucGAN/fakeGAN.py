#########################################################################################
#  Some modules are adpated from https://arxiv.org/abs/1609.05473 work, and then modified. 
#  Github page is https://github.com/LantaoYu/SeqGAN
#########################################################################################

import re
import numpy as np
import tensorflow as tf
import pandas as pd
import random
from dataloader import *
from generator import Generator
from discriminator import Discriminator
from scripts.training_helpers import get_data_frame as get_df
from rollout_generator import ROLLOUT


#########################################################################################
#  Generator  Hyper-parameters
######################################################################################
EMB_DIM = None
HIDDEN_DIM = 64 #32
SEQ_LENGTH = 200
START_TOKEN = 0
PRE_EPOCH_NUM = 120
SEED = 88
BATCH_SIZE = 64
ENDING_WORD = "<END>"
G_STEPS = 6 #1

#########################################################################################
#  Discriminator  Hyper-parameters
#########################################################################################
dis_embedding_dim = None
dis_filter_sizes = [2, 3, 4]
dis_num_filters = [200, 200, 200]
dis_dropout_keep_prob = 0.8
dis_l2_reg_lambda = 0.2
dis_batch_size = 64
d_steps = 1 # 6
dis_pre_epoch_num = 50

#########################################################################################
#  Basic Training Parameters
#########################################################################################
TOTAL_BATCH = 100
generated_num = None
rollout_num = 16

def generate_samples(sess, trainable_model, batch_size, generated_num):
    generated_samples = []
    for _ in range(int(generated_num / batch_size)):
        generated_samples.extend(trainable_model.generate(sess))

    gen_samples = []
    for s in generated_samples:
        parse_line = [int(x) for x in s]
        gen_samples.append(parse_line)

    return np.array(gen_samples)


def pre_train_epoch(sess, trainable_model, data_loader):
    supervised_g_losses = []
    data_loader.reset_pointer()

    for it in range(data_loader.num_batch):
        print('Batch {}'.format(it))
        batch = data_loader.next_batch()
        _, g_loss = trainable_model.pretrain_step(sess, batch)
        print('Loss: {}'.format(g_loss))
        supervised_g_losses.append(g_loss)

    return np.mean(supervised_g_losses)

def find_main_vocab(main_data, vocab, embedding):
    vocab_to_id = {}
    for i in range(len(vocab)):
        vocab_to_id[vocab[i]] = i
    
    main_vocab = set()
    new_vocab = set()
    for data in main_data:
        for word in data.split():
            if word in vocab_to_id:
                main_vocab.add(word)
            else:
                new_vocab.add(word)
    main_embedding_list = []
    main_vocab_list = list(main_vocab)
    for v in main_vocab_list:
        index = vocab_to_id[v]
        main_embedding_list.append(embedding[index])
    return main_vocab_list, main_embedding_list, list(new_vocab)

def convert_to_string(vocab, gen_samples, result_file):
    sentences = []
    for s in gen_samples:
        parse_line = [vocab[x] for x in s]
        sentences.append(' '.join(parse_line))
    with open(result_file, 'w') as fout:
        for s in sentences:
            fout.write(s + '\n')


# you need to write this function.
def load_data(df):
    deceptive = df.loc[df['deceptive'] == 1]['review'].values.tolist()
    genuine = df.loc[df['deceptive'] == 0]['review'].values.tolist()
    return genuine[:600], genuine[600:], deceptive[:600], deceptive[600:]
    

def main():

    random.seed(SEED)
    np.random.seed(SEED)
    assert START_TOKEN == 0

    vocab, embd = read_embedding_vectors()
    EMB_DIM = len(embd[0])
    dis_embedding_dim = EMB_DIM
    embedding = np.asarray(embd)

    df = get_df()

    # genuine_reviews_for_training is an array of genuine reviews for training. Each review is padded to the "SEQ_LENGTH" with "ENDING_WORD".
    genuine_reviews_for_training, genuine_reviews_for_testing, deceptive_reviews_for_training, deceptive_reviews_for_testing = load_data(df)

    all_reviews = genuine_reviews_for_training + genuine_reviews_for_testing + deceptive_reviews_for_training + deceptive_reviews_for_testing

    for review in all_reviews:
        print(review)

    vocab, embedding, new_vocab = find_main_vocab(genuine_reviews_for_training + genuine_reviews_for_testing + deceptive_reviews_for_training + deceptive_reviews_for_testing, vocab, embedding)
    vocab += new_vocab
    
    embedding = np.insert(embedding, 0, np.random.random((1, EMB_DIM)) - 0.5, axis=0)
    embedding = np.concatenate((embedding, np.random.random((len(new_vocab), EMB_DIM)) - 0.5))
    vocab_processor = tf.contrib.learn.preprocessing.VocabularyProcessor(SEQ_LENGTH, tokenizer_fn=tokenizer)
    pretrain = vocab_processor.fit(vocab)
    vocab = ['<UNK>'] + vocab
    vocab_size = len(vocab)
    print("vocab_size: {}".format(vocab_size))

    genuine_reviews_for_training = np.array(list(vocab_processor.transform(genuine_reviews_for_training)))
    genuine_reviews_for_testing = np.array(list(vocab_processor.transform(genuine_reviews_for_testing)))
    deceptive_reviews_for_training = np.array(list(vocab_processor.transform(deceptive_reviews_for_training)))
    deceptive_reviews_for_testing = np.array(list(vocab_processor.transform(deceptive_reviews_for_testing)))

    global generated_num
    generated_num = len(genuine_reviews_for_training)

    gen_data_loader = Gen_Data_loader(BATCH_SIZE)
    gen_data_loader.create_batches(deceptive_reviews_for_training)

    dis_data_loader = Dis_dataloader(BATCH_SIZE)

    # G
    generator = Generator(vocab_size, BATCH_SIZE, EMB_DIM, HIDDEN_DIM, SEQ_LENGTH, START_TOKEN)

    # D
    discriminator = Discriminator(sequence_length=SEQ_LENGTH, num_classes=2, vocab_size=vocab_size, embedding_size=dis_embedding_dim, 
                                filter_sizes=dis_filter_sizes, num_filters=dis_num_filters, type="main", l2_reg_lambda=dis_l2_reg_lambda)

    # D'
    fake_discriminator = Discriminator(sequence_length=SEQ_LENGTH, num_classes=2, vocab_size=vocab_size, embedding_size=dis_embedding_dim, 
                                filter_sizes=dis_filter_sizes, num_filters=dis_num_filters, type="fake", l2_reg_lambda=dis_l2_reg_lambda)

    config = tf.ConfigProto()
    config.gpu_options.allow_growth = True
    sess = tf.Session(config=config)
    sess.run(tf.global_variables_initializer())

    # initialize the generator and discriminator placeholders
    sess.run(generator.embedding_init, feed_dict={generator.embedding_placeholder: embedding})
    sess.run(discriminator.embedding_init, feed_dict={discriminator.embedding_placeholder: embedding})

    #  pre-train generator
    print('Start pre-training of generator for {} steps...'.format(PRE_EPOCH_NUM))
    for epoch in range(PRE_EPOCH_NUM):
        loss = pre_train_epoch(sess, generator, gen_data_loader)
        print("epoch: {}, loss: {} \n".format(epoch, loss))
 
    print('Start pre-training discriminator...')
    train_discriminator(sess, dis_pre_epoch_num, discriminator, dis_data_loader, genuine_reviews_for_training, genuine_reviews_for_testing, deceptive_reviews_for_training, deceptive_reviews_for_testing)

    print('Start pre-training fake-discriminator...')
    train_discriminator(sess, dis_pre_epoch_num, fake_discriminator, dis_data_loader, deceptive_reviews_for_training, deceptive_reviews_for_testing, generator=generator)

    rollout = ROLLOUT(generator, 0.8)


    print('#########################################################################')
    print('Start Adversarial Training...')
    for total_batch in range(TOTAL_BATCH):
        # Train the generator for one step
        for it in range(G_STEPS):
            samples = generator.generate(sess)
            rewards = rollout.get_reward(sess, samples, rollout_num, discriminator)
            feed = {generator.x: samples, generator.rewards: rewards}
            _ = sess.run(generator.g_updates, feed_dict=feed)


            samples = generator.generate(sess)
            rewards = rollout.get_reward(sess, samples, rollout_num, fake_discriminator)
            feed = {generator.x: samples, generator.rewards: rewards}
            _ = sess.run(generator.g_updates, feed_dict=feed)


        # Update roll-out parameters
        rollout.update_params()

        # Train the discriminator
        train_discriminator(sess, d_steps, discriminator, dis_data_loader, genuine_reviews_for_training, genuine_reviews_for_testing, deceptive_reviews_for_training, deceptive_reviews_for_testing, generator)

        # Train the fake-discriminator
        train_discriminator(sess, d_steps, fake_discriminator, dis_data_loader, deceptive_reviews_for_training, deceptive_reviews_for_testing, generator=generator)

        print("batch: {}".format(total_batch + 1))
        eval_loss = discriminator.evaluation_loss(sess, genuine_reviews_for_testing, deceptive_reviews_for_testing)
        print("evaluation loss avg after training discriminator: {}".format(eval_loss))
        discriminator.predict(sess, genuine_reviews_for_testing, deceptive_reviews_for_testing)
        print("############")

        generated_sentences_file = '../data/generated_sentences_batch_{}.txt'.format(total_batch + 1)
        gen_samples = generate_samples(sess, generator, BATCH_SIZE, BATCH_SIZE)
        convert_to_string(vocab, gen_samples, generated_sentences_file)


def train_discriminator(sess, epoch_num, discriminator, dis_data_loader, positive_data, positive_data_for_testing, negative_data=[], negative_data_for_testing=[], generator=None):
    # Train 3 epoch on the generated data and do this for 50 times
    if generator == None:
        dis_data_loader.load_train_data(positive_data, negative_data)
    for epoch in range(epoch_num): #50
        gen_samples = None
        if generator != None:
            gen_samples = generate_samples(sess, generator, BATCH_SIZE, generated_num)
            if len(negative_data):
                gen_samples = np.concatenate([gen_samples, negative_data], 0)
            dis_data_loader.load_train_data(positive_data, gen_samples)
        for _ in range(3):
            dis_data_loader.reset_pointer()
            for it in range(dis_data_loader.num_batch):
                x_batch, y_batch = dis_data_loader.next_batch()
                feed = {
                    discriminator.input_x: x_batch,
                    discriminator.input_y: y_batch,
                    discriminator.dropout_keep_prob: dis_dropout_keep_prob
                }
                _ = sess.run([discriminator.train_op], feed)

        if epoch % 10 == 0:
            if len(negative_data_for_testing) == 0:
                negative_data_for_testing = gen_samples[:len(positive_data_for_testing)]
            eval_loss = discriminator.evaluation_loss(sess, positive_data_for_testing, negative_data_for_testing)
            discriminator.predict(sess, positive_data_for_testing, negative_data_for_testing)
            print("evaluation loss: {}".format(eval_loss))

def tokenizer(iterator):
    for value in iterator:
        yield value.split()

if __name__ == '__main__':
    main()
