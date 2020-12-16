# Start Aggregate

GitHub の Stargazer エンドポイントを用いて、あるリポジトリのスター履歴を取得し、DB に保存します。

## 集計クエリ

### 日毎のスター数

```SQL
select count(*), strftime('%Y-%m-%d', starredAt) as day from starLogs  group by day;
```
