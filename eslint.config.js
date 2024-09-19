import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'; // Подключаем плагин TypeScript
import tsParser from '@typescript-eslint/parser'; // Подключаем TypeScript парсер
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default [
	{ ignores: ['dist'] },
	{
		files: ['**/*.{js,jsx,ts,tsx}'], // Добавляем поддержку ts и tsx файлов
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				ecmaVersion: 'latest',
				ecmaFeatures: { jsx: true },
				sourceType: 'module',
			},
			parser: tsParser, // Указываем TypeScript-парсер
		},
		settings: { react: { version: '18.3' } },
		plugins: {
			react,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			'@typescript-eslint': typescript, // Добавляем TypeScript плагин
		},
		rules: {
			...js.configs.recommended.rules,
			...react.configs.recommended.rules,
			...react.configs['jsx-runtime'].rules,
			...reactHooks.configs.recommended.rules,
			...typescript.configs.recommended.rules, // Подключаем рекомендуемые правила TypeScript
			'react/jsx-no-target-blank': 'off',
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			'react/prop-types': 'off',
			'react/react-in-jsx-scope': 'off',
			'no-unused-vars': 'off',
			'no-undef': 'error',
		},
	},
];
