## Overview

Sailara was a startup I worked on with a friend from July 2022 to January 2023. Unfortunately, the project never launched, but the process was an incredible learning experience. I became more skilled with various technologies (NextJS, React, Firebase, Stripe), how to validate startup ideas, the importance of UI/UX, how to communicate, how to deal with rejection (or just straight up being ignored), and much, much, much more. This readme is a writeup of all my takeaways from this experience so that my future self can refer back to it when I inevitably find myself in front of the same roadblocks again.  

## The idea

Sailara is a platform that seeks to bring together three main user groups: Students, Nonprofits, and Donors. 
- Nonprofits post their opportunities on Sailara and students can filter these opportunities and find ones that suit them. 
- As students participate with these nonprofits, points are added to their accounts. Eventually, students can cash in their points for scholarship money that is provided by donors. 
- Donors gain marketability as well as an avenue through which they can give back to their communities. Donors can choose to give access to their scholarships to students who are participating in causes the donor believes in such as environmentalism or social justice. 
- On the other hand, students gain free access to invaluable opportunities and don't have to sacrifice their family's livelihoods to participate.   
- Nonprofits gain increased participation and no longer have to worry about compensating students themselves and also have access to our built-in email marketing tool, which allows them to target students who have expressed interest in programs similar to theirs.

![The Concept](https://user-images.githubusercontent.com/86907892/211186364-a834271b-d85a-4cb7-b45e-761bfbe27cd2.png)
![User Group Relationships](https://user-images.githubusercontent.com/86907892/211186455-f79cc06e-f1e0-4162-b464-6cadeba8abc7.png)

## The Site (Or atleast as much of it I was able to build out - No Styling)

### This was the skeleton for the home page which students would use to filter for and find programs that interested them:
![Home/Filtering Page](https://user-images.githubusercontent.com/86907892/211186731-bf243ebb-5d4d-47fe-855b-8c008e0a2261.png)

### Program Managers would pay a monthly fee to have "Educator" access which allowed them to make posts:
![Monthly Subscription](https://user-images.githubusercontent.com/86907892/211186659-2d685e42-ec04-42c4-8a54-089dea2890fa.png)

### Paying educators were then granted access to this page where they could manage all their posts:
![Post Management Page](https://user-images.githubusercontent.com/86907892/211186714-a65bbb90-2fa9-4633-bc84-ef1065870abc.png)

### The Interface for educators to make posts:
![Post Editing UI](https://user-images.githubusercontent.com/86907892/211186581-b11ffb6a-fb42-4c5f-82cc-6d650907058b.png)

### Students could preset filtering options which would be used to email them about posts:
![User Profile Options](https://user-images.githubusercontent.com/86907892/211186628-ec2a720b-8238-4682-bf37-fe825df52ec7.png)

## Why it failed

### 1. A lack of user validation

My cofounder and I were convinced that students were dying to participate in more programs and that programs dearly needed some way to reach out to more students. Because of this, we immediately began working on Sailara. I profusely began programming while he started to create a list of nonprofits we could reach out to. 

But at some point (months in) we thought it may be helpful to start speaking to some of these nonprofits, and it just so happened that our very first interview was with a nonprofit in the exact situation we were hoping to solve. They told us about how Covid19 halved their student population and how a platform like ours would be an instant investment. With this one single spark of false hope in hand, we decided our idea was fully validated and ignored  the few other interviews we did with nonprofits who did not seem nearly as enthusiastic.

I largely blame my own enthusiasm and blind-sidedness caused by the fact that I am a developer for us making this mistake. My answer to everything is to write more code and I falsely believed that all I needed to provide was a website and that everyone would be so awestruck they would start handing us money straight away. It unfortunately does not work like that (especially if you're asking for even 5 cents from your user.) Creating software that someone thinks is cool and "might use" is very different from them pulling out their wallet, taking out their credit card, filling out their payment info, and actually keeping their subscription up.

User validation is everything.

### 2. Perfectionism

I was obsessed from the beginning in the idea of buiding a "perfect" site. I wanted to learn and implement all the latest new web technologies and build the most robust website imaginable. Ironically, this hindered progress. ALOT. Instead of making an MVP which we could hand to users and get feedback straight away, I was obsessed with the notion of a giant launch. That one day where we made posts on all our social medias and everyone would blow up the website and money would rain down upon us. The long engineering process caused me to lose motivation and the vision we had initially. The honeymoon phase with the idea was gone and when motivation ran low, I was forced to take steps backwards and realize the many mistakes we'd already made.

99.99% of your users don't care about your tech stack. They only care if their problem is being solved for a price they are willing to pay. Create something jank, understand what needs to be added, removed, and upgraded, and do that thing and nothing more. Iteration and failing fast is key.

### 3. False drive and naiveté

This one is the hardest to admit but likely the root of the first two points of failure. I romantacized the idea of people paying for software I made myself. I fantasized about how succesful this whole thing would be. I did not approach this project with the mind of a businessman, analyzing potential, questioning assumptions, and seeking to maximize revenue. Instead, I just wanted something I could say I was working on because that's what gets peoples' attention.


