import React from 'react';
import '@/styles/navigation.css';
import Navigation from "@/components/headerbar/Navigation";
import AuthButton from "@/components/AuthButton";

export default function HeaderBar() {
    return (
        <section className="navigationBar">
            <div>
                <h1>ProcessFlow</h1>
            </div>
            <nav>
                <Navigation />
            </nav>
            <div className="profile">
                <AuthButton />
            </div>
        </section>
    );
}