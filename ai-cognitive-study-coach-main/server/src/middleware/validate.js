// Generic request-body validator: takes a zod schema, returns Express
// middleware that either replaces req.body with the parsed/typed data
// or responds 400 with a readable list of what's wrong.
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return res.status(400).json({ error: "Validation failed", issues });
    }
    req.body = result.data;
    next();
  };
}
