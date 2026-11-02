import { NextResponse } from 'next/server';
import { couponService } from '@/services/couponService';
import { couponValidateSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = couponValidateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Valid coupon code and order amount required.' },
        { status: 400 }
      );
    }

    const result = await couponService.validate(
      validated.data.code,
      validated.data.orderAmount
    );

    if (!result.valid) {
      return NextResponse.json({ valid: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      coupon: result.coupon,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
