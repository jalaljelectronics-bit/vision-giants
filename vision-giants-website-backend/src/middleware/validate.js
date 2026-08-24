module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, data: null, error: result.error.issues[0].message });
  }
  req.body = result.data;
  next();
};