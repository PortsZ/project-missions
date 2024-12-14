import { object, size, string, optional, pattern, assert } from 'superstruct';
type requestData = {
  termsAndConditions?: string;
  description?: string;
  deliveryTime?: string;
  paymentMethods?: string;
  companyId: string;
};

export async function validateRequest(
  req: Request,
): Promise<requestData | Response> {
  try {
    const data = await req.json();

    const validation = object({
      termsAndConditions: optional(string()),
      description: optional(string()),
      deliveryTime: optional(string()),
      paymentMethods: optional(string()),
      companyId: string(),
    });

    assert(data, validation);
    return data;
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 422 });
  }
}
