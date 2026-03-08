db = db.getSiblingDB('logs_db');

// 1. Rate Limits collection and Section
db.createCollection('rate_limits');

db.rate_limits.createIndex({ "expireAt": 1 }, { expireAfterSeconds: 0 });
db.rate_limits.createIndex({ "userId": 1 });

// 2 - Error Logs
db.createCollection('error_logs');

db.error_logs.createIndex({ "correlation_id": 1 });
db.error_logs.createIndex({ "timestamp": -1 });

print("MongoDB initialization complete: Collections and TTL indexes created.");