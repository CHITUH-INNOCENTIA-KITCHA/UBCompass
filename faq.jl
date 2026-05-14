using Gtk

# ===============================
# FAQ DATABASE (100 QUESTIONS)
# ===============================

faq = Dict(

# GENERAL (1–20)
"what is iuget" => "IUGET is a private higher institution in Douala focused on professional and academic training.",
"where is iuget located" => "IUGET is located in Bonamoussadi, Douala (Rond Point MAETUR).",
"when was iuget created" => "IUGET has over 10 years of existence serving students.",
"what does iuget stand for" => "Institut Universitaire des Grandes Ecoles des Tropiques.",
"what is the mission of iuget" => "To provide high-quality education adapted to global challenges.",
"what is the vision of iuget" => "To become a center of academic excellence and innovation.",
"why choose iuget" => "IUGET offers professional training aligned with the job market.",
"how many students does iuget have" => "Over 4000 students enroll yearly.",
"does iuget have partners" => "Yes, IUGET has over 150 academic and professional partners.",
"how many lecturers are in iuget" => "Over 500 qualified lecturers.",
"what is iuget known for" => "Professional training and high success rates.",
"does iuget offer quality education" => "Yes, it provides structured and career-focused education.",
"what are iuget values" => "Integrity, creativity, diversity, and student focus.",
"does iuget offer innovation programs" => "Yes, especially in engineering and IT.",
"does iuget have multiple campuses" => "Yes, it operates across multiple campuses.",
"what language is used in iuget" => "Both English and French.",
"does iuget have international recognition" => "Yes, through partnerships and certifications.",
"what is iuget goal" => "To train future leaders.",
"does iuget offer practical training" => "Yes, with real-world immersion.",
"does iuget prepare students for jobs" => "Yes, it is job-market oriented.",

# SCHOOLS (21–35)
"what schools are in iuget" => "ISTTI, South Polytech, and SHS.",
"what is istti" => "Business and management school.",
"what is south polytech" => "Engineering and technology school.",
"what is shs" => "School of Health Sciences.",
"does iuget have agriculture school" => "Yes, ECSA.",
"which school offers business programs" => "ISTTI.",
"which school offers engineering" => "South Polytech.",
"which school offers health sciences" => "SHS.",
"does iuget offer IT programs" => "Yes, under South Polytech.",
"does iuget offer business courses" => "Yes, under ISTTI.",
"does iuget offer medical courses" => "Yes, under SHS.",
"which school offers logistics" => "ISTTI.",
"which school offers civil engineering" => "South Polytech.",
"which school offers nursing" => "SHS.",
"does iuget have specialized schools" => "Yes, different schools for each domain.",

# PROGRAMS (36–65)
"what programs does iuget offer" => "Business, engineering, IT, health sciences, and more.",
"does iuget offer bts" => "Yes, BTS programs are available.",
"does iuget offer hnd" => "Yes, HND programs are available.",
"does iuget offer bachelor" => "Yes, Bachelor degrees are available.",
"does iuget offer masters" => "Yes, Master programs are available.",
"does iuget offer mba" => "Yes, MBA programs are available.",
"does iuget offer computer science" => "Yes, IT and software engineering programs exist.",
"does iuget offer finance" => "Yes, finance programs are available.",
"does iuget offer marketing" => "Yes, marketing programs are available.",
"does iuget offer accounting" => "Yes, accounting programs are available.",
"does iuget offer logistics" => "Yes, logistics and transport programs.",
"does iuget offer law" => "Yes, legal studies programs.",
"does iuget offer engineering" => "Yes, engineering programs exist.",
"does iuget offer electrical engineering" => "Yes.",
"does iuget offer civil engineering" => "Yes.",
"does iuget offer renewable energy" => "Yes.",
"does iuget offer communication" => "Yes.",
"does iuget offer journalism" => "Yes.",
"does iuget offer hr management" => "Yes.",
"does iuget offer entrepreneurship" => "Yes.",
"does iuget offer project management" => "Yes.",
"does iuget offer statistics" => "Yes.",
"does iuget offer banking" => "Yes.",
"does iuget offer insurance" => "Yes.",
"does iuget offer design" => "Yes.",
"does iuget offer tourism" => "Yes.",
"does iuget offer agriculture" => "Yes.",
"does iuget offer online learning" => "Yes, e-learning is available.",
"does iuget offer certifications" => "Yes, AWS and data certifications.",
"does iuget offer internships" => "Yes, through partnerships.",

# ADMISSION (66–85)
"how to apply to iuget" => "You can apply online via the official website.",
"does iuget have online registration" => "Yes, pre-registration is online.",
"what documents are needed" => "Academic transcripts, ID, and application form.",
"can i apply online" => "Yes.",
"is admission open" => "Check the website for updates.",
"does iuget accept international students" => "Yes.",
"what is required for admission" => "Relevant previous diploma.",
"does iuget require entrance exam" => "Depends on program.",
"can i transfer to iuget" => "Yes, under conditions.",
"how long is admission process" => "Depends on application review.",
"can i choose my program" => "Yes.",
"can i change program later" => "Yes, under conditions.",
"does iuget have deadlines" => "Yes.",
"can i apply without results" => "Sometimes provisional admission is possible.",
"does iuget offer orientation" => "Yes.",
"does iuget guide students" => "Yes.",
"can parents apply for students" => "Yes.",
"does iuget contact applicants" => "Yes.",
"can i visit campus before applying" => "Yes.",
"does iuget provide admission support" => "Yes.",

# FEES & CAMPUS (86–100)
"how much are tuition fees" => "Fees depend on program.",
"does iuget offer scholarships" => "Scholarships may be available.",
"can i pay fees in installments" => "Yes, depending on policy.",
"does iuget have hostels" => "Contact administration for housing info.",
"does iuget have library" => "Yes.",
"does iuget have labs" => "Yes.",
"does iuget have internet access" => "Yes.",
"does iuget have student activities" => "Yes.",
"does iuget have clubs" => "Yes.",
"does iuget offer sports" => "Yes.",
"what are opening hours" => "Monday to Friday 8am–6pm.",
"is iuget open weekends" => "Saturday half-day.",
"how to contact iuget" => "Call +237 651 26 26 26.",
"does iuget have email" => "Yes, available on website.",
"does iuget have website" => "Yes: www.iuget.cm."
)

# ===============================
# KEYWORD AI SYSTEM
# ===============================

keywords = Dict(
    "location" => "where is iuget located",
    "douala" => "where is iuget located",
    "program" => "what programs does iuget offer",
    "course" => "what programs does iuget offer",
    "fees" => "how much are tuition fees",
    "price" => "how much are tuition fees",
    "apply" => "how to apply to iuget",
    "admission" => "how to apply to iuget",
    "school" => "what schools are in iuget",
    "engineering" => "does iuget offer engineering",
    "business" => "does iuget offer business courses",
    "health" => "what is shs",
    "contact" => "how to contact iuget",
    "phone" => "how to contact iuget"
)

# ===============================
# RESPONSE FUNCTION
# ===============================

function get_response(user_input)
    input = lowercase(strip(user_input))

    # Remove question marks
    input = replace(input, "?" => "")

    if haskey(faq, input)
        return faq[input]
    end

    for (key, question) in keywords
        if occursin(Regex("\\b$key\\b"), input)
            return faq[question]
        end
    end

    return "Sorry, I didn't understand your question. Please try again."
end

# ===============================
# GTK GUI
# ===============================

# Chat history stored as a string
chat_history = ""

win = GtkWindow("IUGET Chatbot", 500, 600)

vbox = GtkBox(:v)
push!(win, vbox)

# Create a scrollable area for chat
scroll = GtkScrolledWindow()
set_gtk_property!(scroll, :hexpand, true)
set_gtk_property!(scroll, :vexpand, true)
push!(vbox, scroll)

chat_display = GtkTextView()
set_gtk_property!(chat_display, :editable, false)
set_gtk_property!(chat_display, :wrap_mode, 2)  # WRAP_WORD
push!(scroll, chat_display)

# Input area
hbox = GtkBox(:h)
push!(vbox, hbox)

entry = GtkEntry()
set_gtk_property!(entry, :hexpand, true)
push!(hbox, entry)

button = GtkButton("Send")
push!(hbox, button)

function send_message(widget)
    user_text = Gtk.get_gtk_property(entry, :text, String)

    if isempty(strip(user_text))
        return
    end

    response = get_response(user_text)

    global chat_history
    chat_history *= "You: $user_text\nBot: $response\n\n"

    # Get buffer and set text
    buffer = Gtk.get_gtk_property(chat_display, :buffer, GtkTextBuffer)
    Gtk.set_gtk_property!(buffer, :text, chat_history)

    # Clear entry
    Gtk.set_gtk_property!(entry, :text, "")

    # Auto-scroll to bottom
    iter = Gtk.GtkTextIter()
    Gtk.text_buffer_get_end_iter(buffer, iter)
    mark = Gtk.text_buffer_create_mark(buffer, C_NULL, iter, false)
    Gtk.text_view_scroll_to_mark(chat_display, mark, 0.0, false, 0.0, 1.0)
end

signal_connect(send_message, button, "clicked")

# Also allow Enter key to send message
signal_connect(entry, "activate") do widget
    send_message(button)
end

showall(win)
