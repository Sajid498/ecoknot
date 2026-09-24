-- Apply after the users and fundraising campaign tables exist.
-- A volunteer receives a capped authorization, never direct control of campaign funds.
CREATE TABLE IF NOT EXISTS volunteer_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    volunteer_id BIGINT NOT NULL,
    responsibility VARCHAR(120) NOT NULL,
    scope VARCHAR(1500),
    approved_budget DECIMAL(14,2) NOT NULL DEFAULT 0,
    spent_budget DECIMAL(14,2) NOT NULL DEFAULT 0,
    status VARCHAR(40) NOT NULL DEFAULT 'PENDING',
    assigned_by BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    UNIQUE KEY uk_campaign_volunteer (campaign_id, volunteer_id),
    CONSTRAINT fk_assignment_volunteer FOREIGN KEY (volunteer_id) REFERENCES users(id),
    CONSTRAINT fk_assignment_admin FOREIGN KEY (assigned_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS fund_disbursements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    amount DECIMAL(14,2) NOT NULL,
    purpose VARCHAR(180) NOT NULL,
    used_at VARCHAR(255) NOT NULL,
    justification VARCHAR(1500) NOT NULL,
    receipt_url VARCHAR(500),
    status VARCHAR(40) NOT NULL DEFAULT 'PENDING_REVIEW',
    reviewed_by BIGINT NULL,
    review_note VARCHAR(255),
    submitted_at DATETIME NOT NULL,
    reviewed_at DATETIME NULL,
    CONSTRAINT fk_disbursement_assignment FOREIGN KEY (assignment_id) REFERENCES volunteer_assignments(id),
    CONSTRAINT fk_disbursement_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id)
);
