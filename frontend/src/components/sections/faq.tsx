"use client"

import { HelpCircle } from "lucide-react"

export function FAQ() {
  return (
    <section id="faq" className="py-40 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-24">
           <h2 className="text-4xl md:text-6xl font-bold tracking-tighter italic">Everything you need to know.</h2>
        </div>
        
        <div className="space-y-8 text-left">
          {[
            { 
              q: "How does ColdMailer protect my email domain reputation?", 
              a: "ColdMailer uses a proprietary 'Multi-Sender Rotation' engine. Instead of sending 500 emails from one account, it sends 10 emails from 50 different accounts. This mimics natural human behavior and prevents your domain from being flagged as a spammer by Gmail and Outlook."
            },
            { 
              q: "Can I use ColdMailer for job applications?", 
              a: "Absolutely. ColdMailer was originally designed for high-end professional outreach. You can upload a list of recruiters, use our dynamic variables to mention specific job titles or company values, and automate your follow-ups to stay on top of their inbox."
            },
            { 
              q: "Is cold emailing legal (GDPR/CAN-SPAM)?", 
              a: "Yes, cold emailing for B2B purposes or job applications is legal as long as you follow specific guidelines: provide an opt-out mechanism, don't use deceptive subjects, and have a legitimate interest. ColdMailer includes built-in compliance features to help you stay safe."
            },
            { 
              q: "Do I need technical skills to set up ColdMailer?", 
              a: "No. Our dashboard is designed for ease of use. Connecting a sender takes 30 seconds via OAuth (Google/Microsoft), and our template editor works just like any modern document editor."
            },
            { 
              q: "What is the difference between ColdMailer and Mailchimp?", 
              a: "Mailchimp is for newsletters (marketing emails). ColdMailer is for cold outreach (sales/networking). Mailchimp emails land in the 'Promotions' tab; ColdMailer emails land in the 'Primary' inbox because they are sent via your actual mail server."
            },
            { 
              q: "How many interviews can I expect as a job seeker?", 
              a: "While results vary by industry and profile, our users report an average of 3-5x more interview invitations compared to traditional 'Easy Apply' methods. The secret is the high-volume, hyper-personalized nature of the outreach."
            },
            { 
              q: "Is there a limit to how many emails I can send?", 
              a: "On the Starter plan, you can send up to 1,000 emails per month. Our Pro plan offers unlimited sending, restricted only by the daily limits of your connected email providers (usually 2,000/day per Gmail account)."
            }
          ].map((faq, i) => (
            <div key={i} className="p-10 bg-[#fafafa] border border-black/[0.03] rounded-[2.5rem] hover:bg-white transition-all">
              <div className="flex items-start gap-4">
                 <HelpCircle className="h-6 w-6 text-indigo-600 shrink-0 mt-1" />
                 <div>
                    <h4 className="text-xl font-bold mb-4">{faq.q}</h4>
                    <p className="text-black/40 leading-relaxed font-medium">{faq.a}</p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
