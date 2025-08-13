/**
 * Enhanced Login Modal
 * Supports both OAuth and email/password authentication with backward compatibility
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
// import {
// 	validateEmail,
// 	validatePassword,
// 	validateDisplayName,
// } from '../../utils/validationUtils';

interface LoginModalProps {
	isOpen: boolean;
	onClose: () => void;

	// Original OAuth-only interface (for backward compatibility)
	onLogin: (provider: 'google' | 'github') => void;

	// New enhanced interfaces (optional)
	onEmailLogin?: (credentials: {
		email: string;
		password: string;
	}) => Promise<void>;
	onOAuthLogin?: (provider: 'google' | 'github') => void;
	onRegister?: (data: {
		email: string;
		password: string;
		name?: string;
	}) => Promise<void>;
	error?: string | null;
	onClearError?: () => void;
}

type AuthMode = 'login' | 'register';

export function LoginModal({
	isOpen,
	onClose,
	onLogin, // Original OAuth interface
	onEmailLogin,
	onOAuthLogin,
	onRegister,
	error,
	onClearError,
}: LoginModalProps) {
	const [mode, setMode] = useState<AuthMode>('login');
	// const [showPassword, setShowPassword] = useState(false);
	// const [isLoading, setIsLoading] = useState(false);

	// Form state
	// const [email, setEmail] = useState('');
	// const [password, setPassword] = useState('');
	// const [name, setName] = useState('');
	// const [confirmPassword, setConfirmPassword] = useState('');

	// Validation errors
	// const [validationErrors, setValidationErrors] = useState<
	// 	Record<string, string>
	// >({});

	// Determine if enhanced features are available
	const hasEmailAuth = !!onEmailLogin;
	const hasRegistration = !!onRegister;

	const resetForm = () => {
		// setEmail('');
		// setPassword('');
		// setName('');
		// setConfirmPassword('');
		// setValidationErrors({});
		// setShowPassword(false);
		if (onClearError) onClearError();
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const switchMode = (newMode: AuthMode) => {
		setMode(newMode);
		resetForm();
	};

	// const validateForm = (): boolean => {
	// 	const errors: Record<string, string> = {};

	// 	// Email validation using centralized utility
	// 	const emailValidation = validateEmail(email);
	// 	if (!emailValidation.valid) {
	// 		errors.email = emailValidation.error || 'Invalid email format';
	// 	}

	// 	// Password validation using centralized utility
	// 	const passwordValidation = validatePassword(password, {
	// 		email: email,
	// 		name: name,
	// 	});
	// 	if (!passwordValidation.valid && passwordValidation.errors) {
	// 		errors.password = passwordValidation.errors[0]; // Show first error
	// 	}

	// 	// Additional validation for registration
	// 	if (mode === 'register') {
	// 		// Name validation using centralized utility
	// 		const nameValidation = validateDisplayName(name);
	// 		if (!nameValidation.valid) {
	// 			errors.name = nameValidation.error || 'Invalid name';
	// 		}

	// 		// Confirm password validation
	// 		if (password !== confirmPassword) {
	// 			errors.confirmPassword = 'Passwords do not match';
	// 		}
	// 	}

	// 	setValidationErrors(errors);
	// 	return Object.keys(errors).length === 0;
	// };

	// const handleSubmit = async (e: React.FormEvent) => {
	// 	e.preventDefault();

	// 	if (!validateForm()) return;

	// 	setIsLoading(true);
	// 	try {
	// 		if (mode === 'login' && onEmailLogin) {
	// 			await onEmailLogin({ email, password });
	// 		} else if (mode === 'register' && onRegister) {
	// 			await onRegister({ email, password, name: name.trim() });
	// 		}
	// 		// Don't auto-close here - let the parent handle success/error
	// 	} catch (err) {
	// 		// Error handling is done in the auth context
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };

	const handleOAuthClick = (provider: 'google' | 'github') => {
		// Use the new interface if available, otherwise fall back to original
		if (onOAuthLogin) {
			onOAuthLogin(provider);
		} else {
			onLogin(provider);
		}
	};

	if (!isOpen) return null;

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-md"
						onClick={handleClose}
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						transition={{ type: 'spring', duration: 0.5 }}
						className="relative z-10 w-full max-w-md mx-auto my-8"
					>
						<div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
							{/* Header */}
							<div className="relative p-6 pb-0">
								<button
									onClick={handleClose}
									className="absolute right-4 top-4 p-2 rounded-lg hover:bg-accent transition-colors"
								>
									<X className="h-4 w-4" />
								</button>

								<div className="text-center space-y-2">
									<div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
										<svg
											className="w-6 h-6 text-primary"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
											/>
										</svg>
									</div>
									<h2 className="text-2xl font-semibold mb-2">
										{hasEmailAuth && mode === 'register'
											? 'Create an account'
											: 'Welcome back'}
									</h2>
									<p className="text-muted-foreground">
										{hasEmailAuth && mode === 'register'
											? 'Join to start building amazing applications'
											: 'Sign in to save your apps and access your workspace'}
									</p>
								</div>
							</div>

							{/* Error display */}
							{error && (
								<div className="mx-6 mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
									<AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
									<p className="text-sm text-destructive">
										{error}
									</p>
								</div>
							)}

							{/* OAuth options */}
							<div className={clsx('p-6 space-y-5 pt-12')}>
								{/* GitHub */}
								<motion.button
									whileTap={{ scale: 0.98 }}
									onClick={() => handleOAuthClick('github')}
									// disabled={isLoading}
									className="w-full group relative overflow-hidden rounded-xl bg-gray-900 dark:bg-[#24292e] p-4 text-white transition-all hover:bg-gray-800 dark:hover:bg-[#1a1e22] border border-gray-800 dark:border-border disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<div className="relative z-10 flex items-center justify-center gap-3">
										<svg
											className="h-5 w-5"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
											/>
										</svg>
										<span className="font-medium">
											Continue with GitHub
										</span>
									</div>
									<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700" />
								</motion.button>

								{/* Google */}
								<motion.button
									whileTap={{ scale: 0.98 }}
									onClick={() => handleOAuthClick('google')}
									// disabled={isLoading}
									className="w-full group relative overflow-hidden rounded-xl bg-white dark:bg-card p-4 text-gray-800 dark:text-foreground transition-all hover:bg-gray-50 dark:hover:bg-card/80 border border-gray-200 dark:border-border disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<div className="relative z-10 flex items-center justify-center gap-3">
										<svg
											className="h-5 w-5"
											viewBox="0 0 24 24"
										>
											<path
												d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
												fill="#4285F4"
											/>
											<path
												d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
												fill="#34A853"
											/>
											<path
												d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
												fill="#FBBC05"
											/>
											<path
												d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
												fill="#EA4335"
											/>
										</svg>
										<span className="font-medium">
											Continue with Google
										</span>
									</div>
									<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-100 dark:via-gray-800 to-transparent group-hover:translate-x-full transition-transform duration-700" />
								</motion.button>
							</div>

							{/* Footer */}
							<div className="px-6 pb-6 space-y-4">
								{/* Mode switching (only if registration is available) */}
								{hasRegistration && (
									<div className="text-center">
										<button
											type="button"
											onClick={() =>
												switchMode(
													mode === 'login'
														? 'register'
														: 'login',
												)
											}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										></button>
									</div>
								)}

								<p className="text-center text-xs text-muted-foreground">
									By continuing, you agree to our{' '}
									<a
										href="#"
										className="underline hover:text-foreground"
									>
										Terms of Service
									</a>{' '}
									and{' '}
									<a
										href="#"
										className="underline hover:text-foreground"
									>
										Privacy Policy
									</a>
								</p>
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>,
		document.body,
	);
}
