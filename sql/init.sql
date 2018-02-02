CREATE DATABASE cmdb
use cmdb

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `password` varchar(128) NOT NULL,
  `name` varchar(32) NOT NULL,
  `email` varchar(128) NOT NULL,
  `gender` int(11) DEFAULT '0' ,
  `created_at` varchar(128) NOT NULL,
  `last_login` varchar(128) NOT NULL,
  `is_admin` tinyint(1)  DEFAULT NULL,
  `frozen` tinyint(1)  DEFAULT NULL,
  `deleted_at` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

CREATE TABLE `asset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idc_id` int(11) DEFAULT '0',
  `asset_type` varchar(128) NOT NULL,
  `model` varchar(128) NOT NULL,
  `conf_id` int(11) DEFAULT '0',
  `sn` varchar(64),
  `service_code` varchar(64),
  `rack_name` varchar(128) ,
  `location` int(11) DEFAULT '0',
  `bios_version` varchar(64),
  `power_state` int(11) DEFAULT '0',
  `site` varchar(64),	
  `network_id` int(11) DEFAULT '0',	
  `contract_id` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

CREATE TABLE `idc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `tag` varchar(64) NOT NULL,
  `location` varchar(128) NOT NULL,
  `floor` varchar(64) NOT NULL,
  `room_num` varchar(64) NOT NULL,
  `mechine_type` varchar(128) NOT NULL,
  `mechine_count` int(11) DEFAULT '0' ,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;


CREATE TABLE `asset_conf` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `cpu` varchar(64) NOT NULL,
  `memory` varchar(64) NOT NULL,
  `disk` varchar(64) NOT NULL,
  `raid` varchar(64) NOT NULL,
  `detail` varchar(254) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

CREATE TABLE `host` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_name` varchar(128) NOT NULL,
  `mechine_type` varchar(64) NOT NULL,
  `ip` varchar(128) NOT NULL,
  `oobip` varchar(128) NOT NULL,
  `env` varchar(64) NOT NULL,
  `asset_id` int(11) DEFAULT '0',
  `hostname` varchar(64) NOT NULL,
  `os_id` int(11) DEFAULT '0' ,
  `owner` varchar(64) NOT NULL,
  `status` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

CREATE TABLE `os` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mechine_type` varchar(128) NOT NULL,
  `name` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

CREATE TABLE `network` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idc_id` int(11) DEFAULT '0',
  `env` varchar(64) NOT NULL,
  `team` varchar(64) NOT NULL,
  `vlan` int(11) DEFAULT '0',
  `route` varchar(64) NOT NULL,
  `mask` varchar(64) NOT NULL,
  `gateway` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;


CREATE TABLE `ip` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addr` varchar(64) NOT NULL,
  `ip_type` varchar(64) NOT NULL,
  `use_type` varchar(64) NOT NULL,
  `host_id` int(11) DEFAULT '0',
  `network_id` int(11) DEFAULT '0',
  `status` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

CREATE TABLE `relay_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(64) NOT NULL,
  `host_id` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

CREATE TABLE `relay_auth` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL,
  `role_id` int(11) DEFAULT '0',
  `start_time` varchar(64) NOT NULL,
  `end_time` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

CREATE TABLE `contract` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(128) NOT NULL,
  `contract_name` varchar(128) NOT NULL,
  `contract_number` varchar(64) NOT NULL,
  `contract_type` varchar(64) NOT NULL,
  `contract_years` int(11) DEFAULT '1',
  `payment_style` varchar(128) NOT NULL,
  `contract_server` varchar(64) NOT NULL,
  `contract_sign_time` varchar(64) NOT NULL,
  `contract_expiration_time` varchar(64) NOT NULL,
  `create_time` varchar(64) NOT NULL,
  `status` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE `hardware_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contract_id` int(11) DEFAULT '0',
  `type` varchar(128) NOT NULL,
  `count` int(11) DEFAULT '0',
  `arrival_count` int(11) DEFAULT '0',
  `model` varchar(64) NOT NULL,
  `asset_conf_id` int(11) DEFAULT '0',
  `site_name` varchar(64) NOT NULL,
  `order_sign_time` varchar(64) NOT NULL,
  `create_time` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `equipment_sn` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT '0',
  `sn` varchar(64) NOT NULL,
  `expiration_time` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


INSERT INTO users ("username", "password", frozen) VALUES ("root", "25d55ad283aa400af464c76d713c07ad", 0)