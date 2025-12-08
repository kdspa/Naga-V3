const { Listener } = require('@sapphire/framework');

const TASK_AMOUNT = 9;

class FinalTasks extends Listener {
  constructor(context, options) {
      super(context, { 
        ...options,
        event: 'startupTaskCompleted' 
      });

      this.completedTasks = new Set();
  }

  run(taskName) {
    this.completedTasks.add(taskName);

    if (this.completedTasks.size === TASK_AMOUNT) {
      const { username, id } = this.container.client.user;
      this.container.logger.info(`Successfully logged in as ${username} (${id})`);
    }
  }
}

module.exports = { FinalTasks }
