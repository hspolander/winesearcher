import fs from 'fs';

const dbConfigPath = '../config/db_config.json';

let config;
const loadConfig = () => {
	config = JSON.parse(fs.readFileSync(__dirname+'/'+dbConfigPath, 'utf8'));
}

export default () => {
	if (config == null) {
	 loadConfig();
	}
	return config;
}