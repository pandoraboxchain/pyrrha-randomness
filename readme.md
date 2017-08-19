# Генератор случайных чисел

[![Join the chat at https://gitter.im/pandoraboxchain/lottery_algorithm](https://badges.gitter.im/pandoraboxchain/lottery_algorithm.svg)](https://gitter.im/pandoraboxchain/lottery_algorithm?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Поставновка задачи

Нахождение наилучшего алгоритма получения "случайного" числа в Solidity

## План работы

1.0. [Анализ существующих решений](1.examples/analyse.md)

1.1. Составление списка контрактов с различными алгоритмами получения случайного числа (2.tests)

1.2. Вычленение из каждого из них кода собственно получения "случайного"

2.0. Выбор алгоритма (с внешней реализацией или внутренней)

2.1. [Контракт "мне нужен рендом из блокхеша"](2.tests/inner_random/readme.md)

- [Random.sol](2.tests/inner_random/truf/contracts/Random.sol)

2.2. [Контракт "я хочу генерировать рендомы + мне нужен рендом"](2.tests/outer_random/readme.md)

- [OutRandom.sol](2.tests/outer_random/truf/contracts/OutRandom.sol)
- [Provider.sol](2.tests/outer_random/truf/contracts/Provider.sol)

2.3. Прогон вариантов на тестовом блокчейне эфира

- [Result Inner Random.csv](2.tests/inner_random/www/results.csv)

- внешний - рендом реальный через практически любой "движок", максимально случайным в сверке берем алгоритм на "движениях мышки"

2.4. Оценка "случайности" полученных случайных чисел каждым вариантом

- [выполняем преобразование равномерного распределения в нормальное](http://ru.math.wikia.com/wiki/%D0%9F%D1%80%D0%B5%D0%BE%D0%B1%D1%80%D0%B0%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5_%D0%91%D0%BE%D0%BA%D1%81%D0%B0_%E2%80%94_%D0%9C%D1%8E%D0%BB%D0%BB%D0%B5%D1%80%D0%B0)

- [сверяем его нормальность](http://r-analytics.blogspot.com/2012/06/blog-post_14.html#.WYhL7uklEuU)

- [результаты сверки](2.tests_r/readme.md)

3.0 Результат работы

3.1. Таблица "цена алгоритма" / "степень нормальности"

|   | 2.1 Внутренний рендом  |  2.2 Внешний рендом |
|---|---|---|
| инициализация  |  412500 | 371757 | 
| стоимость одного числа  |  125856  |  237751 |
| + доп стоимость одного числа |  0  |  337135 / количество чисел у одного провайдера |
|---|---|---|
| cлучайность  |  0.1239 |  0.7686 |

3.2. Создание окончального смартконтракта "случайного числа"

- [Random.sol](3.result/Random.sol)

## Результат работы

Контракт с наиболее случайным из алгоритмов "случайного числа" либо существующих, либо их модификаций


