import tkinter as tk
import random

#Window banao
root=tk.Tk()
root.title("ahmad live AI robot - E6440")
root.geometry("400x500")

# Robot ka Head
canvas=tk.Canvas(root,width=400,height=400,bg="black")
canvas.pack()

# Head
canvas.create_rectangle(100,50,300,280,fill="gray",outline="white",width=2)
# Eyes
left_eye=canvas.create_oval(130,100,170,140,fill="white",outline="black",width=2)
right_eye=canvas.create_oval(230,100,270,140,fill="white",outline="black",width=2)
# Eye pupil - ye hilega
left_pupil=canvas.create_oval(140,110,160,130,fill="black")
right_pupil=canvas.create_oval(240,110,260,130,fill="black")
# Mouth
canvas.create_rectangle(150,200,250,220,fill="red",outline="black",width=2)

status_text=canvas.create_text(200,350,text="salam ahmad !mai live hon",fill="white",font=("Arial",12, "bold"))

def robot_blink():
    # Ankh jhapkana
    # pupil hilana
    x=random.randint(-10,10)
    y=random.randint(-5,5)
    canvas.coords(left_pupil,145+x,115+y,155+x,125+y)
    canvas.coords(right_pupil,245+x,115+y,255+x,125+y)
    root.after(random.randint(500,1000),robot_blink)

    def robot_talk():
        baatein=[
            "python 3.15 install ho gya hai",
            "Main AI seekh raha hoon",
            "E6440 zabardast machine hai",
            "skill develope karon ga",
            "ahmad tum great ho",
        ]
        canvas.itemconfig(status_text,text=random.choice(baatein))
        # Mouth hilana
        canvas.coords(150,200,250,220)
        root.after(2000,robot_talk)

        # Buttons
        def change_mood(mood):
            if mood=="happy":
                canvas.itemconfig(status_text,text="happy robot")
                canvas.itemconfig(left_eye,fill="green")
                canvas.itemconfig(right_eye,fill="green")
            elif mood=="sad":
                canvas.itemconfig(status_text,text="sad robot")
                canvas.itemconfig(left_eye,fill="blue")
                canvas.itemconfig(right_eye,fill="blue")
            elif mood=="angry":
                canvas.itemconfig(status_text,text="angry robot")
                canvas.itemconfig(left_eye,fill="red")
                canvas.itemconfig(right_eye,fill="red")

                btn_frame=tk.Frame(root,bg="black")
                btn_frame.pack()
                tk.Button(btn_frame,text="Happy",command=lambda:change_mood("happy")).pack(side=tk.LEFT,padx=10)
                tk.Button(btn_frame,text="Sad",command=lambda:change_mood("sad")).pack(side=tk.LEFT,padx=10)
                tk.Button(btn_frame,text="Angry",command=lambda:change_mood("angry")).pack(side=tk.LEFT,padx=10)

                # start live robot
                robot_blink()
                robot_look_around()
                robot_talk()

                root.mainloop()
                
