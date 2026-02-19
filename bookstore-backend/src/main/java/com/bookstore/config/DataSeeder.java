package com.bookstore.config;

import com.bookstore.model.Book;
import com.bookstore.model.User;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedBooks();
    }

    private void seedUsers() {
        // Always ensure default users exist with correct passwords
        upsertUser("Admin User", "admin@bookstore.com", "admin123", User.Role.ADMIN);
        upsertUser("John Doe", "customer@bookstore.com", "customer123", User.Role.CUSTOMER);
        log.info("Default users ensured: admin@bookstore.com / admin123, customer@bookstore.com / customer123");
    }

    private void upsertUser(String name, String email, String password, User.Role role) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = User.builder()
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .role(role)
                    .build();
        } else {
            // Always reset password to default for demo purposes
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
        }
        userRepository.save(user);
    }

    private void seedBooks() {
        if (bookRepository.count() == 0) {
            List<Book> books = List.of(
                    Book.builder().title("The Great Gatsby").author("F. Scott Fitzgerald")
                            .genre("Classic Fiction").isbn("978-0-7432-7356-5")
                            .price(new BigDecimal("12.99")).stockQuantity(50)
                            .description(
                                    "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.")
                            .imageUrl("https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg").build(),
                    Book.builder().title("To Kill a Mockingbird").author("Harper Lee")
                            .genre("Classic Fiction").isbn("978-0-06-112008-4")
                            .price(new BigDecimal("14.99")).stockQuantity(35)
                            .description(
                                    "The story of racial injustice and the loss of innocence in the American South.")
                            .imageUrl("https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg").build(),
                    Book.builder().title("1984").author("George Orwell")
                            .genre("Dystopian Fiction").isbn("978-0-452-28423-4")
                            .price(new BigDecimal("11.99")).stockQuantity(60)
                            .description("A dystopian novel set in a totalitarian society ruled by Big Brother.")
                            .imageUrl("https://covers.openlibrary.org/b/isbn/9780452284234-L.jpg").build(),
                    Book.builder().title("Harry Potter and the Sorcerer's Stone").author("J.K. Rowling")
                            .genre("Fantasy").isbn("978-0-590-35340-3")
                            .price(new BigDecimal("19.99")).stockQuantity(80)
                            .description("The first book in the Harry Potter series about a young wizard's adventures.")
                            .imageUrl("https://covers.openlibrary.org/b/isbn/9780590353403-L.jpg").build(),
                    Book.builder().title("The Hobbit").author("J.R.R. Tolkien")
                            .genre("Fantasy").isbn("978-0-618-00221-3")
                            .price(new BigDecimal("16.99")).stockQuantity(45)
                            .description(
                                    "Bilbo Baggins' unexpected journey with a company of dwarves to reclaim their mountain home.")
                            .imageUrl("https://covers.openlibrary.org/b/isbn/9780618002214-L.jpg").build(),
                    Book.builder().title("The Da Vinci Code").author("Dan Brown")
                            .genre("Thriller").isbn("978-0-385-50420-5")
                            .price(new BigDecimal("15.99")).stockQuantity(30)
                            .description(
                                    "A murder mystery involving secret societies, the Holy Grail, and Leonardo da Vinci's artwork.")
                            .imageUrl("https://covers.openlibrary.org/b/isbn/9780385504201-L.jpg").build(),
                    Book.builder().title("Sapiens: A Brief History of Humankind").author("Yuval Noah Harari")
                            .genre("Non-Fiction").isbn("978-0-06-231609-7")
                            .price(new BigDecimal("18.99")).stockQuantity(40)
                            .description("A sweeping narrative of human history from the Stone Age to the modern era.")
                            .imageUrl("https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg").build(),
                    Book.builder().title("Atomic Habits").author("James Clear")
                            .genre("Self-Help").isbn("978-0-7352-1129-2")
                            .price(new BigDecimal("17.99")).stockQuantity(55)
                            .description("An easy and proven way to build good habits and break bad ones.")
                            .imageUrl("https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg").build(),
                    Book.builder().title("The Alchemist").author("Paulo Coelho")
                            .genre("Fiction").isbn("978-0-06-231500-7")
                            .price(new BigDecimal("13.99")).stockQuantity(70)
                            .description(
                                    "A philosophical novel about a young Andalusian shepherd's journey to find treasure.")
                            .imageUrl("https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg").build(),
                    Book.builder().title("Clean Code").author("Robert C. Martin")
                            .genre("Technology").isbn("978-0-13-235088-4")
                            .price(new BigDecimal("39.99")).stockQuantity(25)
                            .description(
                                    "A handbook of agile software craftsmanship for writing clean, maintainable code.")
                            .imageUrl("https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg").build(),
                    Book.builder().title("The Lean Startup").author("Eric Ries")
                            .genre("Business").isbn("978-0-307-88789-4")
                            .price(new BigDecimal("22.99")).stockQuantity(20)
                            .description(
                                    "How today's entrepreneurs use continuous innovation to create radically successful businesses.")
                            .imageUrl("https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg").build(),
                    Book.builder().title("Dune").author("Frank Herbert")
                            .genre("Science Fiction").isbn("978-0-441-17271-9")
                            .price(new BigDecimal("16.99")).stockQuantity(38)
                            .description(
                                    "An epic science fiction novel set in a distant future amidst a feudal interstellar society.")
                            .imageUrl("https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg").build());

            bookRepository.saveAll(books);
            log.info("Seeded {} books into the database", books.size());
        }
    }
}
