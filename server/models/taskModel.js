import { queryDatabase } from "../controllers/db.js";

class taskModel {
  /**
   * Inserts a new task into the database.
   * @param {string} taskName - The name of the task.
   * @param {string} taskDescription - The description of the task.
   * @param {string} taskDueDate - The due date of the task.
   * @param {string} taskPriority - The priority of the task.
   * @param {string} taskStatus - The status of the task.
   * @param {number} userId - The ID of the user creating the task.
   * @returns {Promise<object>} The result of the database operation.
   * @throws {Error} If there is an error during the database operation.
   */
  async createTask(
    taskName,
    taskDescription,
    taskDueDate,
    taskPriority,
    taskStatus,
    userId
  ) {
    try {
      const result = await queryDatabase(
        "INSERT INTO tasks (taskName, taskDescription, taskDueDate, taskPriority, taskStatus, user_id) VALUES (?, ?, ?, ?, ?, ?)",
        [taskName, taskDescription, taskDueDate, taskPriority, taskStatus, userId]
      );
      return result;
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error("Failed to create task.");
    }
  }

  /**
   * Retrieves all tasks from the database.
   * @returns {Promise<Array<object>>} An array of task objects.
   * @throws {Error} If there is an error during the database operation.
   */
  async getAllTasks() {
    try {
      const [rows] = await queryDatabase("SELECT * FROM tasks");
      return rows;
    } catch (error) {
      console.error("Error getting all tasks:", error);
      throw new Error("Failed to get all tasks.");
    }
  }
  /**
   * Retrieves all tasks for a specific user.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Array<object>>} An array of task objects.
   * @throws {Error} If there is an error during the database operation.
   */
  async viewTasksByUserId(userId) {
    try {
      const [rows] = await queryDatabase('CALL GetUserProjectsTasksByUserId(?)', [userId]);
      return rows[0];
    } catch (error) {
      console.error('Error viewing tasks by user ID:', error);
      throw new Error('Failed to view tasks by user ID.');
    }
  }
    /**
   * Updates an existing task in the database.
   * @param {number} taskId - The ID of the task to update.
   * @param {string} taskName - The new name of the task.
   * @param {string} taskDescription - The new description of the task.
   * @param {string} taskDueDate - The new due date of the task.
   * @param {string} taskPriority - The new priority of the task.
   * @param {string} taskStatus - The new status of the task.
   * @returns {Promise<object>} The result of the database operation.
   * @throws {Error} If there is an error during the database operation.
   */
  async updateTask(taskId, taskName, taskDescription, taskDueDate, taskPriority, taskStatus) {
    try {
      const result = await queryDatabase(
        "UPDATE tasks SET taskName = ?, taskDescription = ?, taskDueDate = ?, taskPriority = ?, taskStatus = ? WHERE taskId = ?",
        [taskName, taskDescription, taskDueDate, taskPriority, taskStatus, taskId]
      );
      return result;
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error("Failed to update task.");
    }
  }

  /**
   * Deletes a task from the database.
   * @param {number} taskId - The ID of the task to delete.
   * @returns {Promise<object>} The result of the database operation.
   * @throws {Error} If there is an error during the database operation.
   */
  async deleteTask(taskId) {
    try {
      const result = await queryDatabase(
        "DELETE FROM tasks WHERE taskId = ?",
        [taskId]
      );
      return result;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Failed to delete task.");
    }
  }


};



export default new taskModel();
