import clientPromise from '../mongodb';
import bcrypt from 'bcryptjs';

// User collection in MongoDB
const getUsersCollection = async () => {
  const client = await clientPromise;
  return client.db('green-basket').collection('users');
};

// Create a new user
export async function createUser({ name, email, password }) {
  try {
    const users = await getUsersCollection();
    
    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create the user document
    const user = {
      name,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      orders: [],
      carbonSaved: 0
    };
    
    // Insert into database
    const result = await users.insertOne(user);
    
    // Return the user without the password
    const { password: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, id: result.insertedId.toString() };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Find user by email
export async function findUserByEmail(email) {
  try {
    const users = await getUsersCollection();
    return users.findOne({ email });
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
}

// Find user by id
export async function findUserById(id) {
  try {
    const users = await getUsersCollection();
    return users.findOne({ _id: id });
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
}

// Validate user credentials
export async function validateCredentials(email, password) {
  try {
    const user = await findUserByEmail(email);
    
    if (!user) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return null;
    }
    
    // Return user without the password
    const { password: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, id: user._id.toString() };
  } catch (error) {
    console.error('Error validating credentials:', error);
    throw error;
  }
} 