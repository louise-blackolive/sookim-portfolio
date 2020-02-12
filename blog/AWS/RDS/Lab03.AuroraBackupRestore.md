# [DHK] Lab3. RDS Aurora 의 스냅샷 백업과 복구하기

## 1. 개요

Amazon RDS는 관계형 데이터베이스를 빠르게 프로비저닝 하여 사용자로 하여금 인프라에 신경쓰지 않고 데이터베이스 작업에만 집중 할 수 있도록 도와주는 관리형 서비스이다. 또한 주요 DBA 업무를 웹콘솔에서 손쉽게 설정 및 자동화하여 대규모의 인프라 환경에서 데이터베이스 관리의 부담을 줄여줄 수 있다.

## 2. 여기서 사용하는 서비스

2-1. Infra

- Amazon Web Service
- AWS CloudFormation
- RDS Aurora

2-2. Software

- MySQL 5.7
- Workbench
- Putty 및 Terminal application
- python
- bash shell script

## 3. 목표 아키텍쳐

그림 삽입

## 4. 실습 요약

1. 사용자 정의 파라미터 적용
2. 스냅샷 백업과 시점복구 수행하기
3. Performance Insight 확인하기

## 5. How to

### 5-1. 사용자 정의 파라미터를 RDS 에 적용하기

RDS를 생성 할 때 파라미터 그룹을 명시적으로 지정하지 않으면 default parameter group이 RDS 인스턴스에 할당됩니다. 이 파라미터는 AWS에서 미리 정의 된 값으로 되어있어 데이터베이스를 시작하는데는 문제가 없으나 사용자가 파라미터 값을 수정하려고 하면 수정이 되지 않습니다.
따라서 사용자 정의 파라미터를 사용하기 위해서는 default 파라미터 그룹 외에 명시적으로 파라미터 그룹을 생성 및 수정 후 RDS 인스턴스에 적용시켜야 합니다.

① [RDS] > [Instances] 콘솔로 이동하여 Aurora master인스턴스에 적용 된 파라미터 그룹을 확인합니다.

<그림 삽입>

② 왼쪽 메뉴에서 [Parameter Group] 을 선택하고 [Create Parameter Group] 을 클릭합니다.

③ 생성할 파라미터 그룹에 대한 설정을 아래와 같이 지정합니다.

- Parameter group family : aurora5.6 선택
- Type : DB Cluster Parameter Group 선택
- Group name : aurora-lab-cluster-parameter-group 입력
- description : 그룹 이름을 복사하여 붙여넣기 합니다
- [Create] 버튼을 눌러 생성을 완료합니다.

<그림 삽입>

④ 생성 된 파라미터 그룹을 클릭하여 파라미터 설정을 확인합니다. 상단 필터에 time_zone을 입력하면 타임존과 관련 된 파라미터가 출력됩니다.

- time_zone : Asia/Seoul 선택

타임 존 설정을 위와 같이 변경 한 후 [Save change] 버튼을 클릭합니다.

<그림 삽입>

파라미터의 Apply type에서도 확인 할 수 있듯이 해당 파라미터는 dynamic 타입이기 때문에 데이터베이스 재부팅 없이도 바로 적용할 수 있는 파라미터입니다.
하지만 파라미터 그룹이 변경 될 경우에는 새로운 파라미터 그룹이 적용되려면 재부팅이 필요합니다.

마스터 인스턴스 클릭 후 [Actions] > [Reboot] 클릭
<그림 삽입>

이제 RDS 인스턴스로 돌아가 현재 설정 된 디폴트 파리미터 그룹을 방금 생성 한 파라미터 그룹으로 바꾸어줍니다.

⑤ [RDS] > [Instances] 콘솔에서 Auroar Cluster를 선택 후 [Modify] 버튼 클릭

- DB Cluster parameter group : aurora-lab-cluster-parameter-group 선택
- [Countinue] 클릭

<그림 삽입>

- Scheduling of modifications : Apply immediately 선택
- [Modify cluster] 클릭하여 수정을 완료

<그림 삽입>

수정이 완료되었으면 클러스터 세부정보 페이지로 들어가 설정이 정상적으로 변경되었는지 확인합니다.

⑥ 클러스터 이름 클릭 후 Configuration 탭에서 DB Cluster parameter group 항목 확인

<그림 삽입>

### 5-2. 스냅샷 백업과 복구 수행하기

Snapshot 을 통한 데이터 복구에 후 데이터 확인을 위해서 Shell script 을 활용하여 데이터를 입력합니다. Aurora RDS Time zone(UTC)과 Aurora Client Time Zone(KST)는 9 시간 차이를 가집니다. 이는 Parameter group 의 time_zone 에서 변경 및 적용이 가능하며 5-1 Lab에서 이미 수정 된 설정값이므로 추가 작업 없이 진행합니다.

백업 후 리스토어 수행 시 시점 확인을 위해 Lab02에서 사용했던 쉘 스크립트를 이용합니다.

① EC2 서버에 SSH 접속하여 increase_data.sh 파일을 실행

```
]$ sh ./increase_data.sh
```

<그림 삽입>

RDS 콘솔로 돌아가서 Manual Snapshot을 생성합니다.

② master 인스턴스 선택 후 [Actions] > [take snapshot] 클릭

<그림 삽입>

③ Snapshot name : aurora-lab-manual-snapshot 입력 후 [Tack Snapshot] 클릭

<그림 삽입>

④ 스냅샷 목록에서 생성 시점을 확인합니다

<그림 삽입>

이제 만들어진 스냅샷을 가지고 데이터베이스를 리스토어시켜 스냅샷의 생성 시점과 데이터가 일치하는지 확인 해 봅니다.

⑤ 스냅샷 선택 후 [Actions] > [Restore snapshot] 클릭

- DB Instance Class : db.t2.small 선택
- DB Instance Idendifier : aurora-lab-restore-instance 기재
- [Restore DB instance] 클릭하여 복구 완료

<그림 삽입>

복구 된 새로운 RDS 인스턴스로 접속합니다. 접속은 EC2 인스턴스에서 호스트 엔드포인트만 바꿔줍니다.

```
select max(input_time) from test.increase_data;
```

<그림 삽입>
출력되는 값이 스냅샷이 생성 된 시간대와 동일한지 확인합니다.

시점복구를 테스트하기 위해서는 원하는 시점에 대해 사용자가 지정을 해야하고, 정확히 그 시점으로 돌아가는지 테스트 해봐야합니다.
우선 데이터베이스에 접속 후 데이터가 인서트 된 시점을 훑어봅시다.

```
select * from test.increase_data;
```

나열 된 데이터를 보고 원하는 시점을 선택합니다

⑥ 웹 콘솔에서 클러스터를 선택 후 [Actions] > [Restore to Point in time] 클릭

<그림 삽입>

- Restore time : Custom 선택 후 시간을 입력합니다.
- Custome Date : 오늘 날짜를 선택합니다
- Custom Time : 위 단계에서 선택한 시간을 입력합니다.

<그림 삽입>

- DB Instance class : db.t2.small 선택
- DB Instance Identifier : aurora-lab-pitr-instance
- [Launch DB Instance] 클릭하여 리스토어를 완료합니다.

복구 된 인스턴스가 생성이 완료되었다면, 데이터베이스에 접속하여 데이터를 확인합니다.

```
select max(input_time) from test.increase_data;
```

<그림 삽입>

복구 할 때 지정한 시간과 같은 값이 출력되는지 확인합니다.

### 5-3. Performance Insight 확인하기

이미 부하 테스트 했기 때문에 데이터 남아있을것임
그거 확인하는걸로
