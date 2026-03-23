CREATE TABLE `attestations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attestationId` varchar(64) NOT NULL,
	`agentId` varchar(128) NOT NULL,
	`agentName` varchar(256),
	`cqsScore` int NOT NULL,
	`imdaPillar` enum('Internal Governance','Human Accountability','Technical Robustness','User Enablement') NOT NULL,
	`action` varchar(256) NOT NULL,
	`actionJson` json,
	`riskTier` enum('low','medium','high','critical') NOT NULL,
	`flagged` boolean NOT NULL DEFAULT false,
	`patchedAt` timestamp,
	`modelHash` varchar(128),
	`policyHash` varchar(128),
	`traceJson` json,
	`complianceJson` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attestations_id` PRIMARY KEY(`id`),
	CONSTRAINT `attestations_attestationId_unique` UNIQUE(`attestationId`)
);
--> statement-breakpoint
CREATE TABLE `controls` (
	`id` int AUTO_INCREMENT NOT NULL,
	`controlId` varchar(16) NOT NULL,
	`name` varchar(256) NOT NULL,
	`category` varchar(128) NOT NULL,
	`objective` text,
	`status` enum('pass','warn','fail','pending') NOT NULL,
	`score` int NOT NULL,
	`framework` enum('AICM','IMDA','ExecAI','NIST') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `controls_id` PRIMARY KEY(`id`),
	CONSTRAINT `controls_controlId_unique` UNIQUE(`controlId`)
);
--> statement-breakpoint
CREATE TABLE `guardrails` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ruleId` varchar(64) NOT NULL,
	`description` text,
	`action` enum('block','route_to_hitl','block_and_log','allow_with_audit') NOT NULL,
	`version` int NOT NULL DEFAULT 1,
	`triggerCount` int NOT NULL DEFAULT 0,
	`corpusSize` int DEFAULT 0,
	`lastTriggered` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `guardrails_id` PRIMARY KEY(`id`),
	CONSTRAINT `guardrails_ruleId_unique` UNIQUE(`ruleId`)
);
