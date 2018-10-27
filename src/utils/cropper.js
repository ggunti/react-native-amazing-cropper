const getCropperLimitsIfHorizontally = (imageWidth, imageHeight, W_INT, H_INT, W, H, BW, Q) => {
  let TOP_LIMIT = 0;
  let LEFT_LIMIT = 0;
  let BOTTOM_LIMIT = 0;
  let RIGHT_LIMIT = 0;
  const DIFF = 0;

  let w = 0;
  let h = 0;
  let DIST = 0;
  let TOTAL_DIST = 0;

  const w1 = W_INT;
  const h1 = (W_INT * imageHeight) / imageWidth;
  const w2 = (H_INT * imageWidth) / imageHeight;
  const h2 = H_INT;
  if (h1 <= H_INT) {
    h = h1;
    w = w1;
    DIST = (H_INT - h) / 2;
    TOTAL_DIST = DIST + BW;
    TOP_LIMIT = TOTAL_DIST;
    BOTTOM_LIMIT = TOTAL_DIST + Q;
    LEFT_LIMIT = BW;
    RIGHT_LIMIT = BW;
  } else {
    h = h2;
    w = w2;
    DIST = (W_INT - w) / 2;
    TOTAL_DIST = DIST + BW;
    TOP_LIMIT = BW;
    BOTTOM_LIMIT = BW + Q;
    LEFT_LIMIT = TOTAL_DIST;
    RIGHT_LIMIT = TOTAL_DIST;
  }

  return { TOP_LIMIT, LEFT_LIMIT, BOTTOM_LIMIT, RIGHT_LIMIT, DIFF };
};

const getCropperLimitsIfVertically = (imageWidth, imageHeight, W_INT, H_INT, W, H, BW, Q) => {
  let TOP_LIMIT = 0;
  let LEFT_LIMIT = 0;
  let BOTTOM_LIMIT = 0;
  let RIGHT_LIMIT = 0;
  let DIFF = 0;

  let IMAGE_W = 0;
  let IMAGE_H = 0;
  const IMAGE_W_1 = W_INT;
  const IMAGE_H_1 = (W_INT * imageHeight) / imageWidth;
  const IMAGE_W_2 = (H_INT * imageWidth) / imageHeight;
  const IMAGE_H_2 = H_INT;
  if (IMAGE_H_1 <= H_INT) {
    IMAGE_H = IMAGE_H_1;
    IMAGE_W = IMAGE_W_1;
  } else {
    IMAGE_H = IMAGE_H_2;
    IMAGE_W = IMAGE_W_2;
  }

  let w = 0;
  let h = 0;
  const h1 = W_INT;
  const w1 = (IMAGE_W * h1) / IMAGE_H;
  const w2 = H_INT;
  const h2 = (IMAGE_H * w2) / IMAGE_W;
  if (w1 <= H_INT) {
    w = w1;
    h = h1;
  } else {
    w = w2;
    h = h2;
  }
  const Tnew = (H - h) / 2;
  const Bnew = Tnew + Q;
  const Lnew = (W - w) / 2;
  const Rnew = Lnew;
  DIFF = h - w;
  TOP_LIMIT = Tnew + (DIFF / 2);
  LEFT_LIMIT = Lnew - (DIFF / 2);
  BOTTOM_LIMIT = Bnew + (DIFF / 2);
  RIGHT_LIMIT = Rnew - (DIFF / 2);

  return { TOP_LIMIT, LEFT_LIMIT, BOTTOM_LIMIT, RIGHT_LIMIT, DIFF };
};


const getCropperLimits = (imageWidth, imageHeight, rotation, W_INT, H_INT, W, H, BW, Q) => {
  if (rotation % 180 === 0) {
    return getCropperLimitsIfHorizontally(imageWidth, imageHeight, W_INT, H_INT, W, H, BW, Q);
  }
  return getCropperLimitsIfVertically(imageWidth, imageHeight, W_INT, H_INT, W, H, BW, Q);
};

export { getCropperLimits };
