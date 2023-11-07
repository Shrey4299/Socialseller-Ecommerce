module.exports = async (data) => {
  try {
    const { username, password, connection } = data;
    // // creating user
    // await connection.query(`CREATE USER ${username} WITH PASSWORD '${password}';
    // ALTER ROLE ${username} SET client_encoding TO 'utf8';
    // ALTER ROLE ${username} SET default_transaction_isolation TO 'read committed';
    // ALTER ROLE ${username} SET timezone TO 'UTC';`)
    // creating db
    await connection.query(`CREATE DATABASE ${username}`);
    // // granting privileges
    // await connection.query(` GRANT CONNECT ON DATABASE ${username} TO ${username};
    // GRANT USAGE ON SCHEMA public TO ${username};`)
    console.log("db created!");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
