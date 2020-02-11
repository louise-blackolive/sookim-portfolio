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

⑦
