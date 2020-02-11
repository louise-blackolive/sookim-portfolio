#!/bin/bash

for i in {1..100}
do 
mysql -h database-3.cluster-cwy629cxvxr9.ap-northeast-2.rds.amazonaws.com -u admin -pzmffkdnemxla1! \
        -e 'insert into test.increase_data(input_time)
        values(now());'
        sleep 3
        echo "###################################################"
        echo "$i insert finished : 'date'"
        echo "###################################################"
done