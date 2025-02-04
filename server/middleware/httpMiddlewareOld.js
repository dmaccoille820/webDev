export const logger = (req, res, next) => {
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
  console.log('Request Headers:', req.headers);

  if (res && typeof res.on === 'function') {
    res.on('finish', () => {
      console.log('Response Status:', res.statusCode);
    });
  }
  next();
};

export const setSecurityHeaders = (req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
};

export const clientErrorHandler = (error, req, res, next) => {
  console.error('Client Error:', error);
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(error);
  }
};

export const errorHandler = (error, req, res, next) => {
  console.error('Unhandled Error:', error);
  res.status(500).send({ error: 'Something failed!' });
};
