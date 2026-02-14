"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface PolicyConsentModalProps {
    open: boolean
    onAccept: () => void
}

export function PolicyConsentModal({ open, onAccept }: PolicyConsentModalProps) {
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [privacyAccepted, setPrivacyAccepted] = useState(false)

    const handleAccept = () => {
        if (termsAccepted && privacyAccepted) {
            onAccept()
        }
    }

    const canAccept = termsAccepted && privacyAccepted

    return (
        <Dialog open={open} onOpenChange={() => {}}>
            <DialogContent 
                className="bg-slate-900 border-slate-800 text-white max-w-2xl max-h-[80vh]"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl text-amber-500">Terms and Conditions</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Please review and accept our Terms of Service and Privacy Agreement to continue
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[400px] overflow-y-auto rounded-md border border-slate-800 p-4">
                    <div className="space-y-6">
                        <section>
                            <h3 className="text-lg font-semibold text-amber-500 mb-3">Terms of Service</h3>
                            <div className="text-sm text-slate-300 space-y-2">
                                <p>
                                    Welcome to The Wealth Lounge Investment Portfolio Platform. By accessing and using this platform,
                                    you agree to be bound by these Terms of Service.
                                </p>
                                
                                <h4 className="font-semibold text-white mt-4">1. Acceptance of Terms</h4>
                                <p>
                                    By accessing this platform, you acknowledge that you have read, understood, and agree to be bound
                                    by these Terms of Service and all applicable laws and regulations.
                                </p>

                                <h4 className="font-semibold text-white mt-4">2. Use of Service</h4>
                                <p>
                                    You agree to use this service only for lawful purposes and in accordance with these Terms. You are
                                    responsible for maintaining the confidentiality of your account credentials.
                                </p>

                                <h4 className="font-semibold text-white mt-4">3. Investment Information</h4>
                                <p>
                                    The information provided on this platform is for informational purposes only and does not constitute
                                    financial advice. Past performance is not indicative of future results.
                                </p>

                                <h4 className="font-semibold text-white mt-4">4. User Responsibilities</h4>
                                <p>
                                    You are responsible for reviewing your investment portfolio regularly and ensuring all information
                                    is accurate. You must notify us immediately of any unauthorized access to your account.
                                </p>

                                <h4 className="font-semibold text-white mt-4">5. Limitation of Liability</h4>
                                <p>
                                    The Wealth Lounge shall not be liable for any direct, indirect, incidental, special, consequential
                                    or exemplary damages resulting from your use or inability to use the service.
                                </p>
                            </div>
                        </section>

                        <section className="pt-4 border-t border-slate-800">
                            <h3 className="text-lg font-semibold text-amber-500 mb-3">Privacy Agreement</h3>
                            <div className="text-sm text-slate-300 space-y-2">
                                <p>
                                    Your privacy is important to us. This Privacy Agreement explains how we collect, use, and protect
                                    your personal information.
                                </p>

                                <h4 className="font-semibold text-white mt-4">1. Information Collection</h4>
                                <p>
                                    We collect information you provide directly, including name, email, investment details, and
                                    account activity. We also collect technical data such as IP address and browser type.
                                </p>

                                <h4 className="font-semibold text-white mt-4">2. Use of Information</h4>
                                <p>
                                    We use your information to provide and improve our services, communicate with you about your
                                    investments, and ensure platform security.
                                </p>

                                <h4 className="font-semibold text-white mt-4">3. Data Protection</h4>
                                <p>
                                    We implement industry-standard security measures to protect your personal information from
                                    unauthorized access, disclosure, or destruction.
                                </p>

                                <h4 className="font-semibold text-white mt-4">4. Data Sharing</h4>
                                <p>
                                    We do not sell your personal information. We may share information with service providers who
                                    assist in operating our platform, subject to confidentiality agreements.
                                </p>

                                <h4 className="font-semibold text-white mt-4">5. Your Rights</h4>
                                <p>
                                    You have the right to access, correct, or delete your personal information. You may also
                                    object to processing or request data portability.
                                </p>

                                <h4 className="font-semibold text-white mt-4">6. Cookies</h4>
                                <p>
                                    We use cookies and similar technologies to enhance your experience, analyze usage, and
                                    maintain security. You can control cookie preferences through your browser settings.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={termsAccepted}
                            onCheckedChange={(checked: boolean) => setTermsAccepted(checked)}
                            className="border-slate-700"
                        />
                        <Label
                            htmlFor="terms"
                            className="text-sm text-slate-300 cursor-pointer"
                        >
                            I have read and accept the Terms of Service
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="privacy"
                            checked={privacyAccepted}
                            onCheckedChange={(checked: boolean) => setPrivacyAccepted(checked)}
                            className="border-slate-700"
                        />
                        <Label
                            htmlFor="privacy"
                            className="text-sm text-slate-300 cursor-pointer"
                        >
                            I have read and accept the Privacy Agreement
                        </Label>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleAccept}
                        disabled={!canAccept}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Accept and Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
