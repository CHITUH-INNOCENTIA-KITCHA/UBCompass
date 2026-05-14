using Gtk

# ===============================
# FAQ DATABASE
# ===============================

faq = Dict(
    "what is iuget" => "IUGET is a private higher institution in Douala focused on professional and academic training.",
    "where is iuget located" => "IUGET is located in Bonamoussadi, Douala (Rond Point MAETUR).",
    "what programs does iuget offer" => "IUGET offers programs in business, engineering, IT, and health sciences.",
    "what schools are in iuget" => "IUGET has ISTTI, South Polytech, and SHS.",
    "does iuget offer engineering" => "Yes, engineering programs are offered under South Polytech.",
    "does iuget offer business courses" => "Yes, business programs are offered under ISTTI.",
    "what is shs" => "SHS is the School of Health Sciences at IUGET.",
    "how to apply to iuget" => "You can apply online via the official website or visit campus.",
    "how much are tuition fees" => "Tuition fees depend on the program. Please contact administration for details.",
    "how to contact iuget" => "You can contact IUGET via phone or visit their official website www.iuget.cm."
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
    "cost" => "how much are tuition fees",
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
    input = replace(input, r"[^\w\s]" => "")  # remove punctuation

    # Exact match
    if haskey(faq, input)
        return faq[input]
    end

    # Keyword match (regex word boundary)
    for (key, question) in keywords
        if occursin(Regex("\\b$key\\b"), input)
            return faq[question]
        end
    end

    return "Sorry, I didn’t understand your question. Please try again."
end

# ===============================
# GTK GUI SETUP
# ===============================

win = GtkWindow("IUGET Chatbot", 400, 500)

vbox = GtkBox(:v)
push!(win, vbox)

chat_display = GtkTextView()
set_gtk_property!(chat_display, :editable, false)
push!(vbox, chat_display)

entry = GtkEntry()
push!(vbox, entry)

button = GtkButton("Send")
push!(vbox, button)

# ===============================
# SEND MESSAGE FUNCTION (FIXED)
# ===============================

function send_message(widget)
    user_text = Gtk.get_gtk_property(entry, :text, String)

    if isempty(strip(user_text))
        return
    end

    response = get_response(user_text)

    buffer = Gtk.get_gtk_property(chat_display, :buffer, GtkTextBuffer)

    # FIXED: Proper iterator handling
    iter = GtkTextIter(buffer)
    Gtk.text_buffer_get_end_iter(buffer, iter)

    Gtk.text_buffer_insert(
        buffer,
        iter,
        "\nYou: $user_text\nBot: $response\n",
        -1
    )

    Gtk.set_gtk_property!(entry, :text, "")
end

signal_connect(send_message, button, "clicked")

showall(win)

Gtk.GtkMain()