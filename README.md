# Start Aggregate

GitHub の Stargazer エンドポイントを用いて、あるリポジトリのスター履歴を取得し、DB に保存します。

## 集計結果の CSV への保存方法

```bash
sqlite3 data.sqlite3 '<クエリ>' > results/agg.csv
```

## 集計クエリ

### 日毎のスター数

```sql
select count(*), strftime('%Y-%m-%d', starredAt) as day from starLogs  group by day;
```
