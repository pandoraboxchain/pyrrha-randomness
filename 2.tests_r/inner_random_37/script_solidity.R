data = read.table('results.txt', header=T)

inner_random = data[,1]

ksu <- function(x){
  u1 <- runif(1)
  u2 <- runif(1)
  z1 <- ((((-2)*log(u1))^(1/2))*cos(2*u2*pi))
  z2 <- ((((-2)*log(u1))^(1/2))*sin(2*u2*pi))
  z <- list(z1,z2)
  return (z1);
}
real_rand <- apply(data, c(1), ksu)

hist(real_rand)

qqnorm(real_rand)

shapiro.test(real_rand)
