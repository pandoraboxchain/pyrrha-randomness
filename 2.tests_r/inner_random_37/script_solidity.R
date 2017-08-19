data = read.table('results.txt', header=T)

inner_random = data[,1]

ksu <- function(x){
  z1 <- ((((-2)*log(x))^(1/2))*cos(2*x*pi))
  z2 <- ((((-2)*log(x))^(1/2))*sin(2*x*pi))
  z <- list(z1,z2)
  return (z1);
}
real_rand <- apply(data, c(1), ksu)
print(real_rand);

hist(real_rand)

qqnorm(real_rand)

shapiro.test(real_rand)

ad.test(real_rand)
