# [DHK] Lab2. RDS Aurora 의 주요 기능 활용하기

## 1. 개요

<hr/>
Amazon RDS는 관계형 데이터베이스를 빠르게 프로비저닝 하여 사용자로 하여금 인프라에 신경쓰지 않고 데이터베이스 작업에만 집중 할 수 있도록 도와주는 관리형 서비스이다. 또한 주요 DBA 업무를 웹콘솔에서 손쉽게 설정 및 자동화하여 대규모의 인프라 환경에서 데이터베이스 관리의 부담을 줄여줄 수 있다.

## 2. 여기서 사용하는 서비스

<hr/>
2-1. Infra

- Amazon Web Service
- AWS CloudFormation
- RDS Aurora

2-2. Software

- MySQL 5.7
- Workbench
- Putty 및 Terminal application

## 3. 목표 아키텍쳐

<hr/>
그림 삽입

## 4. 실습 요약

<hr/>
1. 읽기 복제본 생성 및 AutoScaling 적용하기
2. Failover 수행 및 영향도 확인하기
3. 스냅샷 백업과 시점복구 수행하기
4. Performance Insight 확인하기

## 5. How to

### 5-1. RDS 읽기 복제본 Auto Scaling 적용하기

Aurora는 읽기 작업에 대한 부하가 매우 많을 경우 읽기복제본이 병렬적으로 증가 하여 서비스를 유지 할 수 있도록 Auto Scaling 기능을 제공하고 있습니다.

현재 생성 된 RDS Aurora 인스턴스를 확인 해 보면 Master 한 대로 클러스터가 구성이 된 것을 확인 할 수 있습니다.

① [RDS] > [Instances] 로 이동하여 생성 된 Aurora를 확인 및 인스턴스가 생성 된 가용영역을 확인합니다.

<그림 삽입>

Auto Scaling을 사용하려면 먼저 기본 인스턴스와 적어도 하나의 Aurora 복제본이 있는 Aurora DB 클러스터를 생성해야 합니다. Auto Scaling 기능이 Aurora의 복제본을 관리하더라도 처음에 적어도 하나의 읽기 복제본이 Aurora DB 클러스터에 있어야 합니다.

따라서 읽기 복제본 하나를 먼저 생성 합니다.

② 실습 대상 Aurora Cluster를 선택 후 오른쪽 상단 메뉴에서 [Actions] > [Add reader] 메뉴를 선택

<그림 삽입>

③ 읽기 복제본에 대한 설정값을 아래와 같이 선택합니다.

- Availability Zone : 윗 부분에서 확인 한 Master 인스턴스가 위치한 AZ 와 반대의 AZ를 선택합니다.

  <사진 삽입>

- DB Instance Identifier : 식별 가능한 이름으로 지정합니다 (aurora-lab-mysql56-reader)

      <사진 삽입>

  [Add reader] 를 클릭하여 생성을 완료합니다

읽기 복제본 생성이 완료 되었으면 Auto Scaling 설정을 시작합니다.

④ 실습대상 클러스터를 선택 후 [Actions] > [Add replica autoscaling] 메뉴를 선택

<그림 삽입>

⑤ 읽기 Auto Scaling 설정을 아래와같이 선택합니다

- Policy name : 식별 가능한 이름으로 기재합니다 (aurora-autoscaling-test)
- Target value : 50

  <그림 삽입>

- Minimum capacity : 1
- Maximum capacity : 2

  <그림 삽입>

[Add policy] 버튼을 눌러 설정을 완료합니다.

이제 EC2 인스턴스에서 RDS로 부하를 주어 Auto Scaling 설정이 정상적으로 되었는지 확인 해 봅니다.

⑥ EC2 인스턴스에 SSH 접속을 합니다.

<그림 삽입>

⑦ vi 편집기를 열어 아래 내용을 작성합니다.

```
]$ vi loadtest.py
```

아래 내용을 붙여넣기 합니다

```
import mysql.connector
import socket
import time
import thread
import random
import threading
import sys

# Global Variables
start_time = time.time()
query_count = 0
lock = threading.Lock()

def thread_func(host_endpoint, username, password, schema, max_id):
    # Specify that query_count is a global variable
    global query_count

    # Loop Indefinitely
    while True:
        try:
            # Resolve the endpoint
            host_name = socket.gethostbyname(host_endpoint)

            # Generate a random number to use as the lookup value
            key_value = str(random.randrange(1, max_id))

            # Create the SQL query to execute
            sql_command = "select * from sbtest1 where id={0};".format(key_value)

            # Connect to the reader endpoint
            conn = mysql.connector.connect(host=host_name, user=username, passwd=password, database=schema, autocommit=True)

            # Execute query
            conn.cmd_query(sql_command)

            # Close the connection
            conn.close()

            # Increment the executed query count
            with lock:
                query_count += 1
        except:
            # Display any exception information
            print(sys.exc_info()[1])


def progress():
    # Loop indefinitely
    while True:
        # Format an output string
        output = "{0}\r".format(int(query_count / (time.time()-start_time)))

        # Write to STDOUT and flush
        sys.stdout.write(output)
        sys.stdout.flush()

        # Sleep this thread for 1 second
        time.sleep(1)

# Entry Point
host_endpoint = '<aurora-readonly-endpoint>'
username = '<user>'
password = '<Password>'
schema = 'test'
max_id = 2500000
thread_count = 25

# Start progress thread
thread.start_new_thread(progress, ())

# Start readers
for thread_id in range(thread_count):
        thread.start_new_thread(thread_func, (host_endpoint, username, password, schema, max_id,))

# Loop indefinitely to prevent application exit
while 1:
        pass
```

저장하고 빠져나온 후 스크립트를 실행시킵니다.

```
python loadtest.py
```

웹콘솔로 가서 읽기 복제본에 부하가 얼마나 가는지 확인합니다.

<그림 삽입>

CPU 사용률 50%가 넘은 후로 읽기 복제본이 추가되었는지 확인합니다.

<그림 삽입>

테스트가 완료되었으면 SSH 창에서 Ctr+C 를 눌러 파이썬 스크립트를 종료합니다. 종료하지 않으면 부하가 계속 가기 때문에 멈춰주세요

### 5-2. Failover 수행 후 영향도 확인하기

테스트용 테이블 생성

```
create table test.increase_data(
id int not null auto_increment primary key,
input_time datetime not null);
```

EC2 Server에서 쉘 스크립트를 작성하고 실행

```
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
```

데이터 계속 들어가게 냅두고
웹 콘솔에서 마스터 페일오버 수행

이벤트 페이지에서 페일오버 완료되었는지 확인 및 writer 변경되었는지 확인
failover 완료 후에 스크립트가 계속 수행되고 있는지 확인.
데이터베이스에 접속 및 데이터를 조회하여 데이터가 인서트 되었는지 확인
