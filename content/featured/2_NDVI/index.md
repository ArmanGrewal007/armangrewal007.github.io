---
date: '2'
title: 'Satellite image analysis over Phillipines'
cover: './ndvi.png'
external: 'https://github.com/ArmanGrewal007/ndvi_vals/blob/master/ArmanSinghGrewal_12017712.pdf'
github: 'https://github.com/ArmanGrewal007/ndvi_vals'
tech:
  - Python 
  - Data Analysis
  - Machine Learning
---

<u>_Abstract_</u>- This paper is a brief of analysis on `Crowd-sourced Mapping dataset`, freely available on UCI ML repository which was donated by Brian Johnson on 25 May, 2016. First approach was to fit a `RandomForestClassifier` on the dataset, but accuracy was not on par (**64%**) as training and testing sets had different probability distributions. 
<br>
Later on we reshuffled the dataset and tried more models. After hyperparameter tuning we achieved accuracy of **97%**.