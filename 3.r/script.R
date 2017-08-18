data = read.table('results.txt', header=T)

inner_random = data[,1]

hist(inner_random)

shapiro.test(inner_random)
