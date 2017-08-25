main <- function(filename){
  
  data = read.table(filename)
  
  inner_random = data[,1]
  
  hist(inner_random)
  
  inner_max <- max(inner_random)
  
  inner_min <- min(inner_random)
  
  norm_length <- length(inner_random)
  
  tmp_norm_rand <- numeric(norm_length)
  
  j = 0;
  for (i in 1:(norm_length/2 - 1)) {
    u1 <- inner_random[2*i]
    u2 <- inner_random[2*i+1];
    
    u1 = 2 * (u1 - inner_min)/(inner_max - inner_min) - 1;
    u2 = 2* (u2 - inner_min)/(inner_max - inner_min) - 1;
    s = u1 * u1 + u2 * u2;
    if (s == 0 || s > 1) {
      #donothing
    } else {
      R <- sqrt(-2*log(s) / s )
      x <- u1 * R
      y <- u2 * R
      tmp_norm_rand[j] = x;
      tmp_norm_rand[j+1] = y;
      j = j + 2;
    }
  }
  j = j - 2;
  print (tmp_norm_rand);
  
  norm_rand <- numeric(j);
  
  for (i in 1:j) {
    norm_rand[i] =  tmp_norm_rand[i];
  }
  
  print (norm_rand);
  
  hist(norm_rand)
  
  qqnorm(norm_rand)
  
  print(shapiro.test(norm_rand))
  
}


main('E:\\WWW\\lottery_algorithm\\4.reviewed\\r\\10000_10000.txt')
