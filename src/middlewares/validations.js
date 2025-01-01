const { asyncHandler } = require("exhandlers");
const { z } = require("zod");

const validateUrl = asyncHandler(async (req, res, next) => {
  const schema = z.object({
    url: z.string().url("Invalid URL format").nonempty("URL cannot be empty"),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ status: false, message: error.errors });
  }
});

const validateCode = asyncHandler(async (req, res, next) => {
  const schema = z
    .string()
    .min(6, "Code must be exactly 6 characters")
    .max(6, "Code must be exactly 6 characters")
    .nonempty("URL cannot be empty");
  try {
    schema.parse(req.params.code);
    next();
  } catch (error) {
    return res.status(400).json({ status: false, message: error.errors });
  }
});

module.exports = { validateUrl, validateCode };
