import React from 'react';

const ExchangePolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 underline">EXCHANGE POLICY</h1>

            <div className="space-y-6 text-base">
                <p>
                    We offer a hassle-free and risk-free 7days replacement policy. Our replacement policy lasts 7 days, which means you have 7 days after receiving your item to request a return or replacement. If 7 days have gone by since the date of delivery (Date of delivery included in counting 7 days), unfortunately, we can't offer you a replacement.
                </p>

                <p>
                    To initiate the replacement buyer needs to send us all required/specified photos or videos of the product within 7 days of delivery. The date of delivery is included in counting 7 days. If you receive a product on 01/01/2025, then the last date to request for replacement is 07/01/2025 till 11:59 PM.
                </p>

                <p>
                    Our technical team will review the photos or videos sent by you. After reviewing your photos or videos, the decision on your request will be taken.
                </p>

                <p>
                    If you send a required photo or video specified by PAELESS after 7 days of the delivery, we can't offer you a replacement. Please note that the customer needs to provide all required information to initiate a replacement. We cannot process your request with partial or incomplete visual proofs or information.
                </p>

                <p>
                    To be eligible for a return or replacement, your product must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging.
                </p>

                <p>
                    We are happy to give you an exchanging if:
                </p>

                <ul className="list-disc list-outside ml-5 space-y-2">
                    <li className="pl-2">You received the damaged or defective items.</li>
                    <li className="pl-2">The package is lost in transit due to the carrier's error. (If an order is prepaid)</li>
                    <li className="pl-2">You receive the wrong item which is different from what is ordered.</li>
                </ul>

                <p>
                    Once your request for replacement is approved by our technical team, someone from the courier partner's team will arrive at the address for a pickup within 2-4 business days. After the product is delivered at PAELESS the team of experts will review your product. If your claim is accurate then we will immediately ship a new product for you as a replacement. But if there is some difference in the actual condition of the product and your claim, then you will be eligible for a partial refund. (Valid visual proof will be shared with you)
                </p>

                <p>
                    Please note that the replacements are approved only if there is a manufacturing defect, or you received the product in physically damaged condition. In such cases customer needs to provide the unboxing video of the product.
                </p>

                <p>
                    Customers are eligible for a replacement with the same product originally ordered. Please note that replacements cannot be made with different products; they must be identical to the original item ordered.
                </p>

                <p>
                    Depending on where you live, the time it may take for your exchanged product to reach you may vary.
                </p>

                <p>
                    You can contact us for any replacement questions at{' '}
                    <a href="mailto:support@paeless.com" className="text-blue-600 hover:underline">
                        support@paeless.com
                    </a>.
                </p>

                <p className="font-bold text-lg">RETURN</p>
                <p>
                    If any scenario if you want to return the product need to return with in 7 days after delivery.
                </p>

                <p className="font-bold text-lg">Refund Policy</p>
                <p>
                    Once the refund is approved it will take 7 business days to credit to your bank account.
                </p>
            </div>
        </div>
    );
};

export default ExchangePolicy;