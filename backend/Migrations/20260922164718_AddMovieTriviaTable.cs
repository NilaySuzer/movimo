using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddMovieTriviaTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MovieTrivias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MovieId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieTrivias", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "MovieTrivias",
                columns: new[] { "Id", "Content", "MovieId", "Title" },
                values: new object[,]
                {
                    { 1, "Nobel ödüllü astrofizikçi Kip Thorne, filmdeki Gargantua kara deliğinin görselleştirilmesi için denklemler yazdı. Bu simülasyonlar astrofizik literatürüne yeni bilimsel makaleler kazandırdı.", 1, "🌌 Bilimsel Danışmanlık & Kara Delik" },
                    { 2, "Christopher Nolan, CGI kullanmak yerine film için Calgary'de gerçekten 500 dönümlük mısır tarlası ektirdi. Çekimler bittikten sonra mısırlar satılarak prodüksiyona kâr sağlandı.", 1, "🌽 500 Dönümlük Gerçek Mısır Tarlası" },
                    { 3, "Joker'in nezarethanede Gordon terfi ettirildiğinde alaycı şekilde alkışladığı sahne senaryoda yoktu; tamamen Heath Ledger'ın doğaçlamasıydı.", 2, "🃏 Heath Ledger'ın Doğaçlama Alkışı" },
                    { 4, "Hastane patlatma sahnesinde minyatür yerine Battersea'deki gerçek bir yıkım alanı kullanıldı. Patlamada yaşanan kısa duraklama kontrollü bir efekt gecikmesiydi ve Ledger sahneyi bozmadan devam ettirdi.", 2, "💥 Gerçek Hastane Patlaması" },
                    { 5, "Stop-motion tekniğiyle çekilen filmde kuklaların kafalarının içinde mikro dişli mekanizmaları vardı. Bir animatörün sadece 1-2 saniyelik sahneyi tamamlaması bazen bir tam haftasını alıyordu.", 4, "⏱️ Saniyede 24 Kare Emek" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MovieTrivias");
        }
    }
}
