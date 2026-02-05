CREATE DATABASE IF NOT EXISTS ai_app;
USE ai_app;
CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    filename VARCHAR(255),
    result VARCHAR(255),
    confidence FLOAT
);

-- Insert some sample data
INSERT INTO predictions (filename, result, confidence) VALUES
('sample1.jpg', 'Normal', 0.95),
('sample2.jpg', 'Benign', 0.12),
('sample3.jpg', 'Malignant', 0.87);
