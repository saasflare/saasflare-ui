/**
 * @fileoverview Fumadocs source loader — bridges the MDX collection to a Fumadocs source tree.
 * @module apps/ui/lib/source
 */
import {docs} from 'collections/server';
import {loader} from 'fumadocs-core/source';

export const source = loader({
    baseUrl: '/docs',
    source: docs.toFumadocsSource(),
});
