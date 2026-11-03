import { app } from 'electron'
import path from 'path'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

// 1. Get user data path & define database file
const userDataDir = app.getPath('userData')
const filePath = path.join(userDataDir, 'tomatune.db')

// 2. Open or create database
const sqlite = new Database(filePath)

sqlite.exec(`CREATE TABLE IF NOT EXISTS tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    duration INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    added_date INTEGER NOT NULL
); `)

export const db = drizzle(sqlite, { schema })
export * from './schema'
