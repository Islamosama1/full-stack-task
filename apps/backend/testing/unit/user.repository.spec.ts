import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { UserRepository } from '../../src/auth/repositories/user.repository'
import { User, UserDocument } from '../../src/auth/schemas/user.schema'

describe('UserRepository', () => {
  let repository: UserRepository
  let execMock: jest.Mock
  let findOneMock: jest.Mock
  let createMock: jest.Mock

  const mockUser = {
    _id: 'some-id',
    name: 'Test',
    email: 'test@example.com',
    password: 'hashed',
  } as unknown as UserDocument

  beforeEach(async () => {
    execMock = jest.fn()
    findOneMock = jest.fn().mockReturnValue({ exec: execMock })
    createMock = jest.fn()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken(User.name),
          useValue: { findOne: findOneMock, create: createMock },
        },
      ],
    }).compile()

    repository = module.get<UserRepository>(UserRepository)
  })

  afterEach(() => jest.clearAllMocks())

  describe('findByEmail', () => {
    it('queries by email and returns the matching user', async () => {
      execMock.mockResolvedValue(mockUser)

      const result = await repository.findByEmail('test@example.com')

      expect(findOneMock).toHaveBeenCalledWith({ email: 'test@example.com' })
      expect(result).toBe(mockUser)
    })

    it('returns null when no user matches the email', async () => {
      execMock.mockResolvedValue(null)

      const result = await repository.findByEmail('unknown@example.com')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('delegates to the model and returns the created document', async () => {
      createMock.mockResolvedValue(mockUser)
      const data = { name: 'Test', email: 'test@example.com', password: 'hashed' }

      const result = await repository.create(data)

      expect(createMock).toHaveBeenCalledWith(data)
      expect(result).toBe(mockUser)
    })
  })
})
