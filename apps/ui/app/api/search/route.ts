/**
 * @fileoverview Docs search endpoint — powers the in-page Fumadocs search UI.
 * @module apps/ui/app/api/search/route
 */
import {createFromSource} from 'fumadocs-core/search/server';
import {source} from '@/lib/source';

export const {GET} = createFromSource(source);
