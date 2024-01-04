import { User } from './user.entity';

describe('UserEntity', () => {

  it('should initialize', () => {
    const user = new User({});
    expect(user).toBeInstanceOf(User);
  });

  describe('constructor', () => {
    
    it('should assign provided values', () => {
      const user = new User({
        id: '123', 
        email: 'test@email.com'
      });

      expect(user.id).toBe('123');
      expect(user.email).toBe('test@email.com');
    });

  });

  describe('id', () => {

    it('should set and get id', () => {
      const user = new User({});

      user.id = '123';
      expect(user.id).toBe('123');
    });

  });

  describe('email', () => {

    it('should set and get email', () => {
      const user = new User({});

      user.email = 'test@email.com';
      expect(user.email).toBe('test@email.com');

      user.email = 'new@email.com';
      expect(user.email).toBe('new@email.com');
    });

    // it('should throw on invalid email', () => {
    //   const user = new User({});

    //   expect(() => {
    //     user.email = 'invalid';
    //   }).toThrow();
    // });

  });

  describe('password', () => {

    it('should set and get password', () => {
      const user = new User({});

      user.password = 'password123';
      expect(user.password).toBe('password123');
    });

  });

  describe('name', () => {

    it('should set and get name', () => {
      const user = new User({});

      user.name = 'Test User';
      expect(user.name).toBe('Test User');
    });

  });

  describe('lastName', () => {

    it('should set and get lastName', () => {
      const user = new User({});

      user.lastName = 'Last';
      expect(user.lastName).toBe('Last');
    });

  });

  describe('phone', () => {

    it('should set and get phone', () => {
      const user = new User({});

      user.phone = '555-1234';
      expect(user.phone).toBe('555-1234');
    });

  });

  describe('verified', () => {

    it('should set and get verified', () => {
      const user = new User({});

      user.verified = true;
      expect(user.verified).toBe(true);
    });

  });

  describe('deleted', () => {

    it('should set and get deleted', () => {
      const user = new User({});

      user.deleted = false;
      expect(user.deleted).toBe(false);
    });

  });

  describe('null values', () => {

    it('should handle null values', () => {
      const user = new User({
        name: null,
        phone: null
      });

      expect(user.name).toBeNull();
      expect(user.phone).toBeNull();
    });

  });

});
