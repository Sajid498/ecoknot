CREATE DATABASE IF NOT EXISTS ecoknot_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE ecoknot_db;

CREATE TABLE IF NOT EXISTS fund_campaigns (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(160) NOT NULL,
    category VARCHAR(40) NOT NULL,
    description VARCHAR(4000) NOT NULL,
    beneficiary VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    contact_number VARCHAR(255) NOT NULL,
    goal_amount DECIMAL(14,2) NOT NULL,
    raised_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    status VARCHAR(40) NOT NULL DEFAULT 'PENDING_REVIEW',
    author_id BIGINT NOT NULL,
    reviewed_by BIGINT NULL,
    review_note VARCHAR(255) NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    reviewed_at DATETIME NULL,
    CONSTRAINT fk_fund_campaign_author FOREIGN KEY (author_id) REFERENCES users(id),
    CONSTRAINT fk_fund_campaign_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS fund_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    reply_to_id BIGINT NULL,
    body VARCHAR(1500) NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_fund_comment_campaign FOREIGN KEY (campaign_id) REFERENCES fund_campaigns(id),
    CONSTRAINT fk_fund_comment_author FOREIGN KEY (author_id) REFERENCES users(id),
    CONSTRAINT fk_fund_comment_parent FOREIGN KEY (reply_to_id) REFERENCES fund_comments(id)
);

CREATE TABLE IF NOT EXISTS fund_reactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    UNIQUE KEY uk_fund_reaction (campaign_id, user_id),
    CONSTRAINT fk_fund_reaction_campaign FOREIGN KEY (campaign_id) REFERENCES fund_campaigns(id),
    CONSTRAINT fk_fund_reaction_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS fund_contributions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    donor_id BIGINT NOT NULL,
    amount DECIMAL(14,2) NOT NULL,
    payment_method VARCHAR(255) NOT NULL,
    payment_reference VARCHAR(255) NOT NULL,
    payment_status VARCHAR(40) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL,
    verified_at DATETIME NULL,
    verified_by BIGINT NULL,
    UNIQUE KEY uk_fund_payment_reference (payment_reference),
    CONSTRAINT fk_fund_contribution_campaign FOREIGN KEY (campaign_id) REFERENCES fund_campaigns(id),
    CONSTRAINT fk_fund_contribution_donor FOREIGN KEY (donor_id) REFERENCES users(id),
    CONSTRAINT fk_fund_contribution_verifier FOREIGN KEY (verified_by) REFERENCES users(id)
);
