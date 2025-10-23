import { z } from 'zod';

// List of common disposable email domains to block
const disposableEmailDomains = [
  '10minutemail.com',
  'tempmail.com',
  'guerrillamail.com',
  'mailinator.com',
  'yopmail.com',
  'temp-mail.org',
  'throwawaymail.com',
  'fakeinbox.com',
  'trashmail.com',
  'disposablemail.com',
  'tempinbox.com',
  'maildrop.cc',
  'getairmail.com',
  'sharklasers.com',
  'grr.la',
  'guerrillamailblock.com',
  'guerrillamail.org',
  'guerrillamail.net',
  'guerrillamail.biz',
  'armyspy.com',
  'cuvox.de',
  'dayrep.com',
  'einrot.com',
  'fleckens.hu',
  'gustr.com',
  'jourrapide.com',
  'rhyta.com',
  'superrito.com',
  'teleworm.us',
  'mailforspam.com',
  'emailtemporaneo.com',
  'tempmailaddress.com',
  'mozej.com',
  'mailmetrash.com',
  'tafmail.com',
  '8chan.co',
  'discard.email',
  'discardmail.com',
  'discardmail.de',
  'spambog.com',
  'spambog.de',
  'spambog.ru',
  'lhsdv.com',
  'tmpeml.info',
  'tmpmail.org',
  'tmail.ws',
  'tmails.net',
  'tmail.io',
  'tmails.xyz',
  'tmails.fun',
  'tmails.top',
  'tmails.site',
  'tmails.club',
  'tmails.space',
  'tmails.online',
  'tmails.app'
];

// Custom email validation with disposable email checking
const emailSchema = z.string().email('Please enter a valid email address').refine(
  (email) => {
    const domain = email.split('@')[1].toLowerCase();
    return !disposableEmailDomains.includes(domain);
  },
  {
    message: 'Please use a legitimate email provider (Gmail, Yahoo, Outlook, etc.)',
    path: ['email']
  }
);

// Login validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

// Register validation schema
export const registerSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: emailSchema,
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Password reset validation schema
export const resetPasswordSchema = z.object({
  email: emailSchema
});

// Validate login form data
export const validateLogin = (data) => {
  try {
    loginSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    const errors = {};
    if (error.issues) {
      error.issues.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
    } else if (error.errors) {
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
    }
    return { success: false, errors };
  }
};

// Validate register form data
export const validateRegister = (data) => {
  try {
    registerSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    const errors = {};
    if (error.issues) {
      error.issues.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
    } else if (error.errors) {
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
    }
    return { success: false, errors };
  }
};

// Validate password reset form data
export const validateResetPassword = (data) => {
  try {
    resetPasswordSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    const errors = {};
    if (error.issues) {
      error.issues.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
    } else if (error.errors) {
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
    }
    return { success: false, errors };
  }
};