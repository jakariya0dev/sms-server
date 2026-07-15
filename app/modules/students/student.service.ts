import { prisma } from '../../lib/prisma';
import { UserRole } from '@prisma/client';
import bcrypt from 'bcrypt'; 

const createStudentIntoDB = async (payload: any) => {
  const { email, password, guardians, ...studentData } = payload;

  // Hash the password before saving to the database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Use a transaction to ensure both rows are created successfully
  const newStudent = await prisma.$transaction(async (tx) => {
    // 1. Generate the associated User row
    const newUser = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.STUDENT, // Set role automatically to STUDENT[cite: 4]
        schoolId: studentData.schoolId,[cite: 8]
      },
    });

    // 2. Prepare guardian data if provided[cite: 9]
    const guardianData = guardians?.map((guardian: any) => ({
      ...guardian,
      dateOfBirth: guardian.dateOfBirth ? new Date(guardian.dateOfBirth) : undefined,
    })) || [];

    // 3. Generate the Student row linked to the new User[cite: 9]
    const student = await tx.student.create({
      data: {
        ...studentData,
        userId: newUser.id, // Associate the generated user row[cite: 9]
        dateOfBirth: new Date(studentData.dateOfBirth),[cite: 9]
        StudentGuardians: {
          create: guardianData, // Create nested guardians if they exist[cite: 9]
        },
      },
      include: {
        user: true, // Include user data in the final response[cite: 9]
        StudentGuardians: true,[cite: 9]
      },
    });

    return student;
  });

  return newStudent;
};

export const StudentService = {
  createStudentIntoDB,
};