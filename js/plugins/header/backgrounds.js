/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const importAll = (r) => r.keys().map(r);
export const backgroundImgs = importAll(require.context('../../../assets/img/backgrounds/', false, /\.(png|jpe?g|svg)$/));
