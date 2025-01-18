import { logger } from "./application/logging.js";
import { web } from "./application/web.js";

web.listen(3001, () => {
  logger.info('Server running on port 3001');
});
