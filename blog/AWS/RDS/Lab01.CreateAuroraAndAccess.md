# [DHK] Lab01. Aurora 인스턴스 생성 & 접속하기

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
1. CloudFormation 을 이용해 실습환경 셋팅하기 
2. RDS 인스턴스 생성하기
3. 데이터베이스에 접속 해 보기

## 5. How to
<hr/>

### 5-1. 실습 환경 셋팅하기
**<span style="color:red"> < 이 워크샵은 서울리전 (ap-northeast-2) 에서 진행됩니다.></span>**

현재 접속 중인 웹 콘솔의 리전이 서울로 선택되어있는지 확인하세요

① [EC2] > [Key pairs] > [Create keypairs] 클릭

    I.	Key pair name : aurora-lab-key 입력

    <그림 삽입>

    II.	[Create] 클릭 하고 다운로드 되는 pem파일을 저장 해 둡니다.

② [CloudFormation] > [Stack] > [Create stack] 을 클릭하여 스택 생성을 시작합니다.

③ Specify template 화면에서

    I.	Amazon S3 URL을 아래 주소를 복사하여 붙여넣기 합니다

    https://sookim-education.s3.ap-northeast-2.amazonaws.com/Materials/DeliveryHero/cf-designer.json

    <그림 삽입>

④ Specify stack details 화면에서

    I.	Stack name : aurora-lab 입력

    II.	KeyName : aurora-lab-key 선택

    <그림 삽입>

    III. 나머지는 그대로 두고 [Next] 클릭

⑤ [Create stack] 을 클릭하여 스택 생성을 완료합니다.

<그림 삽입>

### 5-2. RDS 인스턴스 생성하기
① [RDS] > [Database] > [Create database] 클릭

